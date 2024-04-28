import React, { useState } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";

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
            const response = await axios.post("https://itachiytdownloader.fr.to/api/v1/instaDownload", { url: link });
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
        <div id="container" className="container">
            <nav className="flex flex-row justify-between pt-3 px-4 text-white">
                <ul className="flex flex-row space-x-10">
                    <li>
                        <a href="/" className="font-bold">YouTube</a>
                    </li>
                    <li>
                        <a href="/insta" className="font-bold">Instagram</a>
                    </li>
                </ul>
            </nav>
            <h2 className="text-white text-3xl pb-6 pt-4 font-extrabold w-full text-center mt-10">
                ITACHI INSTAGRAM DOWNLOADER
            </h2>
            <div className="bg-white h-1"></div>

            <div className="w-[768px] h-full flex justify-center items-center flex-col p-4 relative rounded-md">
                <form className="mt-8 flex justify-between p-1 items-center" onSubmit={handleDownload}>
                    <input
                        onChange={(e) => setLink(e.target.value)}
                        type="text"
                        placeholder="Enter the URL"
                        className="px-4 py-2 rounded-md border-3 border-none focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 hover:bg-[#839ae5] bg-[#4050e2] text-white rounded-md font-bold focus:outline-none m-3"
                        disabled={loading}
                    >
                        {loading ? <BounceLoader color="#FFFFFF" size={30} /> : "Download Video"}
                    </button>
                </form>
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>

            <footer className="flex flex-col items-center py-4 bg-white">
                <p>✔ Last update: April 2024 Update</p>
                <a href="https://github.com/pasan2002/Youtube-Video-Downloader-Extension" target="_blank" rel="noopener noreferrer" title="View on Github" className="flex items-center mt-2 h-7 sm:h-9 px-2.5 text-xs sm:text-base text-white hover:bg-[#839ae5] bg-[#4050e2] rounded">
                    <AiFillGithub />
                    <span className="ml-2">View on Github</span>
                </a>
            </footer>
        </div>
    );
}
