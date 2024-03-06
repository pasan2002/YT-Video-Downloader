import React from "react"
import BounceLoader from "react-spinners/BounceLoader"

export default function Download() {
    // useState
    const [link, setLink] = React.useState("")
    const [vidInfo, setVidInfo] = React.useState(null)
    const [resolution, setResolution] = React.useState("")
    const [loader, setLoader] = React.useState(false)

    // functions
    async function getVideoInfo(link) {
        try {
            setLoader(true);
            const videoIDMatch = link.match(
                /youtu(?:\.be|be\.com)\/(?:[\w\-]+\?v=)?([^\?&\"\<>]+)/
            )

            if (!videoIDMatch) {
                throw new Error("Invalid YouTube URL")
            }

            const videoID = videoIDMatch[1]

            const response = await fetch(
                `http://localhost:5000/api/v1/get-vid-info/${videoID}`
            );

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }

            const data = await response.json()
            const durationResponse = await fetch(
                `http://localhost:5000/api/v1/get-video-duration/${videoID}`
            )
            if (!durationResponse.ok) {
                throw new Error(`API request failed with status ${durationResponse.status}`)
            }

            const durationData = await durationResponse.json();

            setLoader(false);
            setVidInfo({
                ...data,
                duration: durationData.duration,
            });
            setResolution(data.lastQuality)

            console.log(data)
        } catch (error) {
            console.error("Error fetching video information:", error)
        }
    }
    
    function download(){
        const videoIDMatch = link.match(
            /youtu(?:\.be|be\.com)\/(?:[\w\-]+\?v=)?([^\?&\"\<>]+)/
        )
        const videoID = videoIDMatch[1]
        const url = `http://localhost:5000/video-download?id=${videoID}&resolution=${resolution}`
        window.location.href = url
    }

    return (
        <div className="w-[600px] h-[500px] bg-bg-color flex justify-start items-center flex-col p-4 border-orange-500 border-[5px] relative rounded-md">
            <h2 className="text-txt-color text-3xl pb-6 pt-4 font-extrabold">
                Itachi Youtube Video Downloader
            </h2>
            <div className="mt-8 flex justify-between items-center">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        getVideoInfo(link);
                    }}
                >
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        placeholder="Enter the URL"
                        className="px-4 py-2 rounded-md border-[3px] border-none focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 w-full"
                        required
                    />
                </form>
                <button
                    onClick={() => getVideoInfo(link)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-slate-600 focus:outline-none"
                >
                    Add Url
                </button>
            </div>
            <div>
                {loader ? (
                    <div className="w-full py-5 text-center">
                        <BounceLoader color="#fff" />
                    </div>
                ) : vidInfo && (
                    <div className="flex px-4 gap-3">
                        <img
                            src={vidInfo.thumbnailUrl}
                            alt={vidInfo.title}
                            className="max-w-[200px] rounded-md h-[150px] mt-2"
                        />
                        <div className="text-white flex gap-2 flex-col">
                            <h3 className="mt-2">{vidInfo.title.slice(0, 70)}</h3>
                            <span>Time: {vidInfo.duration} seconds</span>
                            <div className="flex gap-3 mt-3">
                                <select
                                    onChange={(e) => setResolution(e.target.value)}
                                    name="Resolution Selector"
                                    id=""
                                    className="px-3 py-2 outline-none border border-slate-700 text-slate-700 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    {vidInfo.videoQuality.length > 0 &&
                                        vidInfo.videoQuality.map((v, i) => (
                                            <option key={i} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                </select>
                                <button 
                                onClick={download}
                                className="px-3 py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-slate-600 focus:outline-none">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
