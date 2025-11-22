import React from "react"
import BounceLoader from "react-spinners/BounceLoader"
import { Link } from "react-router-dom";

//icons
import {AiFillGithub} from "react-icons/ai"


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
                /youtu(?:\.be|be\.com)\/(?:[\w-]+\?v=)?([^?&"<>]+)/
            )

            if (!videoIDMatch) {
                throw new Error("Invalid YouTube URL")
            }

            const videoID = videoIDMatch[1]

            const response = await fetch(
                `https://itachiytdownloader.fr.to/api/v1/get-vid-info/${videoID}`
            );

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }

            const data = await response.json()
            const durationResponse = await fetch(
                `https://itachiytdownloader.fr.to/api/v1/get-video-duration/${videoID}`
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
            /youtu(?:\.be|be\.com)\/(?:[\w-]+\?v=)?([^?&"<>]+)/
        )
        const videoID = videoIDMatch[1]
        const url = `https://itachiytdownloader.fr.to/video-download?id=${videoID}&resolution=${resolution}`
        window.location.href = url
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
                    ITACHI YOUTUBE DOWNLOADER
                </h2>

                <div className="w-full bg-white h-1 mb-4"></div>

                <div className="w-full">
                    <form className="flex space-x-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            getVideoInfo(link);
                        }}>
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
                            Get URL
                        </button>
                    </form>
                </div>

                {loader ? (
                    <div className="w-full py-3 text-center">
                        <BounceLoader color="#4A90E2" />
                    </div>
                ) : vidInfo && (
                    <div className="flex flex-col sm:flex-row p-3 gap-3 w-full items-center">
                        <img
                            src={vidInfo.thumbnailUrl}
                            alt={vidInfo.title}
                            className="w-32 h-24 rounded-md"
                        />
                        <div className="flex flex-col gap-2 w-full">
                            <h3>{vidInfo.title.slice(0, 70)}</h3>
                            <span>Time: {vidInfo.duration} seconds</span>
                            <div className="flex gap-3 mt-2">
                                <select
                                    onChange={(e) => setResolution(e.target.value)}
                                    className="px-2 py-1 rounded-md border border-gray-300 focus:border-blue-500"
                                >
                                    {vidInfo.videoQuality.map((v, i) => (
                                        <option key={i} value={v}>{v}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={download}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="w-full mt-4 py-2 text-center text-xs">
                    <p>✔ Last update: April 2024 Update</p>
                    <a href="https://github.com/pasan2002/Youtube-Video-Downloader-Extension" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 mt-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <AiFillGithub />
                        <span>View on Github</span>
                    </a>
                </footer>
            </div>
        </div>
    );
}
