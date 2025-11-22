import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { Link } from "react-router-dom";
import API_URL from "./config";

// Icons
import { AiFillGithub } from "react-icons/ai";

export default function Insta() {
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDownload(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        try {
            const response = await axios.post(`${API_URL}/api/v1/instaDownload`, { url: link });
            const downloadUrl = response.data.links.url_list[0]; 
            
            setLoading(false);
            if (downloadUrl) {
                
            window.location.href = downloadUrl;
        } else {
            setError("No download URL found in response.");
        }

        } catch (err) {
            setError("Failed to download video.");
            setLoading(false);
            console.error(err);
        }
    }

    return (
        <div className="flex justify-center items-center w-full">
            <div className="max-w-xl w-full flex flex-col items-center px-4 py-4 rounded-md">
                <nav className="w-full flex justify-between py-2 text-white">
                    <ul className="flex flex-row space-x-4 sm:space-x-10">
                        <li>
                            <Link to="/" className="font-bold">YouTube</Link>
                        </li>
                        <li>
                            <Link to="/insta" className="font-bold">Instagram</Link>
                        </li>
                        <li>
                            <Link to="/facebook" className="font-bold">Facebook</Link>
                        </li>
                        <li>
                            <Link to="/tiktok" className="font-bold">TikTok</Link>
                        </li> 
                    </ul>
                </nav>
                <h2 className="sm:text-3xl mt-2 mb-4 text-center font-bold text-white">
                    ITACHI INSTA DOWNLOADER
                </h2>
                <div className="bg-white h-1 mb-4 w-full"></div>

                <div className="w-full">
                    <form className="flex space-x-3" onSubmit={handleDownload}>
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
                            disabled={loading}
                        >
                            {loading ? <BounceLoader color="#FFFFFF" size={30} /> : "Download"}
                        </button>
                    </form>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </div>

                <footer className="w-full mt-4 py-2 text-center text-xs">
                    <p>✔ Last update: April 2024 Update</p>
                    <a href="https://github.com/pasan2002/Youtube-Video-Downloader-Extension" target="_blank" rel="noopener noreferrer" title="View on Github" className="flex items-center justify-center gap-2 mt-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <AiFillGithub />
                        <span>View on Github</span>
                    </a>
                </footer>
            </div>
        </div>
    );
}
