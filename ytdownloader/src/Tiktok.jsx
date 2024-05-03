import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";

export default function Tiktok() {
    const [link, setLink] = useState("");
    const [vidInfo, setVidInfo] = useState(null);
    const [downloadLink, setDownloadLink] = useState("");
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    async function getVideoInfo(e) {
        e.preventDefault();
        setLoader(true);
        setError("");

        console.log("Sending URL to API:", link);

        try {
            const response = await axios.post("https://itachiytdownloader.fr.to/api/v1/tikDownload", { url: link });
            const data = response.data.links.data;
            setVidInfo({
                title: data.title,
                duration: data.duration,
            });
            setDownloadLink(data.video);
        } catch (error) {
            setError(`Error fetching video information: ${error.response ? error.response.data.error : error.message}`);
            console.error("Error fetching video information:", error);
        } finally {
            setLoader(false);
        }
    }

    function download() {
        if (downloadLink) {
            window.open(downloadLink, '_blank');  
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
                    ITACHI TIKTOK DOWNLOADER
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
                        <div className="flex flex-col gap-2 w-full">
                            <h3>Title: {vidInfo.title}</h3>
                            <span>Duration: {vidInfo.duration}</span>
                            <button onClick={download} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Download Video
                            </button>
                        </div>
                    </div>
                )}

                <footer className="w-full mt-4 py-2 text-center text-xs">
                    <p>✔ Last update: April 2024 Update</p>
                    <a href="https://github.com/pasan2002/Youtube-Video-Downloader-Extension" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 mt-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <AiFillGithub />
                        <span>View on Github</span>
                    </a>
                </footer>
            </div>
        </div>
    );
}
