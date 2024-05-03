const express = require("express");
const app = express();
const cors = require("cors");
const ytdl = require("ytdl-core");
const { chain, forEach } = require("lodash");
const ffmpegPath = require("ffmpeg-static");
const { spawn } = require("child_process");
const sanitize = require("sanitize-filename");
const instagramGetUrl = require("instagram-url-direct")
const { ndown, tikdown } = require("nayan-media-downloader")

app.use(express.json());
app.use(cors());

//*Youtube Video Downloading*//
const getResolutions = (formats) => {
  let resolutionArray = [];

  for (let i = 0; i < formats.length; i++) {
    if (formats[i].qualityLabel !== null) {
      resolutionArray.push(formats[i]);
    }
  }
  return [...new Set(resolutionArray.map((v) => v.height))];
};

app.get("/api/v1/get-vid-info/:vidId", async (req, res) => {
  const { vidId } = req.params;
  try {
    const { videoDetails, formats } = await ytdl.getInfo(vidId);
    const { title, thumbnails } = videoDetails;
    const videoQuality = getResolutions(formats);
    return res.status(200).json({
      title,
      thumbnailUrl: thumbnails[thumbnails.length - 1].url,
      videoQuality,
      lastQuality: videoQuality[0],
    });
  } catch (error) {
    console.error("Error fetching video information:", error);
    res.status(500).json({ error: "Failed to fetch video information" });
  }
});

app.get("/api/v1/get-video-duration/:vidId", async (req, res) => {
    const { vidId } = req.params;
    try {
        const { videoDetails } = await ytdl.getInfo(vidId);
        const { lengthSeconds } = videoDetails;
        return res.status(200).json({
            duration: lengthSeconds,
        });
    } catch (error) {
        console.error("Error fetching video duration:", error);
        res.status(500).json({ error: "Failed to fetch video duration" });
    }
});


app.get("/video-download", async (req, res) => {
  const { id, resolution } = req.query;
  try {
    const { videoDetails: { title }, formats } = await ytdl.getInfo(id);
    const videoFormats = chain(formats)
      .filter((format) => format.height && format.height === parseInt(resolution) && format.codecs?.startsWith("avc1"))
      .orderBy("fps", "desc")
      .head()
      .value();

    const streams = {};
    streams.video = ytdl(id, { quality: videoFormats.itag });
    streams.audio = ytdl(id, { quality: "highestaudio" });

    const pipes = {
      opt: 1,
      err: 2,
      video: 3,
      audio: 4,
    };

    const ffmpegInputOption = {
      video: [
        "-i", `pipe:${pipes.video}`,
        "-i", `pipe:${pipes.audio}`,
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "copy",
        "-c:a", "libmp3lame",
        "-crf", "27",
        "-preset", "veryfast",
        "-movflags", "frag_keyframe+empty_moov",
        "-f", "mp4",
      ],
    };

    const ffmpegOption = [
      ...ffmpegInputOption.video,
      "-loglevel", "error",
      "-",
    ];

    const ffmpegProcess = spawn(
        ffmpegPath,
        ffmpegOption,
        {
            stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"]
        }
    );


    const errorHandler = (err) => console.log(err);
    forEach(streams, (stream, format) => {
      const dest = ffmpegProcess.stdio[pipes[format]];
      stream.pipe(dest).on("error", errorHandler);
    });

    ffmpegProcess.stdio[pipes.opt].pipe(res);
    let ffmpegLog = "";

    ffmpegProcess.stdio[pipes.err].on(
      "data",
      (chunk) => (ffmpegLog += chunk.toString())
    );

    ffmpegProcess.on(
      "exit",
      (exitCode) => {
        if (exitCode === 1) {
          console.log(ffmpegLog);
        }
        res.end();
      }
    );

    ffmpegProcess.on(
      "close",
      () => ffmpegProcess.kill()
    );

    const filename = `${encodeURI(sanitize(title))}.mp4`;
    res.setHeader("Content-type", "video/mp4");
    res.setHeader("content-Disposition", `attachment;filename=${filename}`);
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

//*Instagram Video Downloader**/
app.post("/api/v1/instaDownload", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    let links = await instagramGetUrl(url);
    res.status(200).json({ message: "Downloading URL:", links });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(400).json({ error: "Failed to create download link", details: error.message });
  }
});

//*Facebook Video Downloader*//
app.post("/api/v1/fbDownload", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    let links = await ndown(url);
    res.status(200).json({ message: "Downloading URL:", links });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(400).json({ error: "Failed to create download link", details: error.message });
  }
});

//*TikTok Video Downloader*//
app.post("/api/v1/tikDownload", async (req, res) => {
  const {url} = req.body
  if(!url) {
    return res.status(400).json({error: "Enter an URL"})
  }

  try{
    let links = await tikdown(url)
    res.status(200).json({message: "Downloading URL: ", links})
  }catch(error){
    console.error("Error creating link:", error);
    res.status(400).json({ error: "Failed to create download link", details: error.message });
  }
})


const port = 5000;
app.get("/", (req, res) => res.send("Hello world"));
app.listen(port, () => console.log(`Server is listening on port ${port}`));
