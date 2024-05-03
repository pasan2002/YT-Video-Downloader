import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";

export default function Facebook() {
    const [link, setLink] = useState("");
    const [vidInfo, setVidInfo] = useState(null);
    const [resolutionLinks, setResolutionLinks] = useState({ sd: "", hd: "" });
    const [selectedResolution, setSelectedResolution] = useState("sd");
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    async function getVideoInfo(e) {
        e.preventDefault();
        setLoader(true);
        setError("");

        console.log("Sending URL to API:", link);

        try {
            const response = await axios.post("https://itachiytdownloader.fr.to/api/v1/fbDownload", { url: link });
            const data = response.data.links.data;
            setVidInfo({
                thumbnail: data[0].thumbnail, 
                title: "Video from Facebook", 
                duration: "Unknown" 
            });
            const sd = data.find(item => item.resolution === "360p (SD)");
            const hd = data.find(item => item.resolution === "720p (HD)");
            setResolutionLinks({ 
                sd: sd ? sd.url : '', 
                hd: hd ? hd.url : ''
            });
        } catch (error) {
            setError(`Error fetching video information: ${error.response ? error.response.data.error : error.message}`);
            console.error("Error fetching video information:", error);
        } finally {
            setLoader(false);
        }
    }

    function download() {
        const url = resolutionLinks[selectedResolution];
        if (url) {
            window.open(url);
        }
    }

    return (
        <div className="flex justify-center items-center w-full">
            <div className="max-w-xl w-full flex flex-col items-center px-4 py-4 rounded-md">
                <nav className="w-full flex justify-between py-2 text-white">
                    <ul className="flex space-x-4 sm:space-x-10">
                        <li><Link to="/" className="font-bold">YouTube</Link></li>
                        <li><Link to="/insta" className="font-bold">Instagram</Link></li>
                        <li><Link to="/facebook" className="font-bold">Facebook</Link></li>
                        <li><Link to="/tiktok" className="font-bold">TikTok</Link></li> 
                    </ul>
                </nav>

                <h2 className="sm:text-3xl mt-2 mb-4 text-center font-bold text-white">
                    ITACHI FB DOWNLOADER
                </h2>

                <div className="w-full bg-white h-1 mb-4"></div>

                <div className="w-full">
                    <form className="flex space-x-3" onSubmit={getVideoInfo}>
                        <input
                            onChange={(e) => setLink(e.target.value)}
                            type="text"
                            placeholder="Enter the URL"
                            className="flex-grow px-2 py-1 border rounded-md focus:outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                            Get Info
                        </button>
                    </form>
                </div>

                {loader && (
                    <div className="w-full py-3 text-center">
                        <BounceLoader color="#4A90E2" />
                    </div>
                )}
                {error && (
                    <div className="text-red-500">{error}</div>
                )}
                {vidInfo && (
                    <div className="flex flex-col sm:flex-row p-3 gap-3 w-full items-center">
                        <img
                            src={vidInfo.thumbnail}
                            alt="Facebook Video"
                            className="w-32 h-24 rounded-md"
                        />
                        <div className="flex flex-col gap-2 w-full">
                            <h3>Title: {vidInfo.title}</h3>
                            <span>Duration: {vidInfo.duration}</span>
                            <div onChange={e => setSelectedResolution(e.target.value)}>
                                <input type="radio" value="sd" name="resolution" defaultChecked /> SD
                                <input type="radio" value="hd" name="resolution" /> HD
                            </div>
                            <button onClick={download} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Download Video
                            </button>
                        </div>
                    </div>
                )}

                <footer className="w-full mt-4 py-2 text-center text-xs">
                    <p>✔ Last update: April 2024 Update</p>
                    <a href="https://github.com/pasan2002/Youtube-Video-Downloader-Extension" target="_blank" className="flex items-center justify-center gap-2 mt-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <AiFillGithub />
                        <span>View on Github</span>
                    </a>
                </footer>
            </div>
        </div>
    );
}
