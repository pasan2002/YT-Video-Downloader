import React from "react"
import BounceLoader from "react-spinners/BounceLoader"

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
                /youtu(?:\.be|be\.com)\/(?:[\w\-]+\?v=)?([^\?&\"\<>]+)/
            )

            if (!videoIDMatch) {
                throw new Error("Invalid YouTube URL")
            }

            const videoID = videoIDMatch[1]

            const response = await fetch(
                `https://tame-jade-pronghorn-tutu.cyclic.app/api/v1/get-vid-info/${videoID}`
            );

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }

            const data = await response.json()
            const durationResponse = await fetch(
                `https://tame-jade-pronghorn-tutu.cyclic.app/api/v1/get-video-duration/${videoID}`
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
        const url = `https://tame-jade-pronghorn-tutu.cyclic.app/video-download?id=${videoID}&resolution=${resolution}`
        window.location.href = url
    }

    return (
        
        <div id="container" className="flex justify-center items-center h-screen" class="container" >
            {/* Header Title */}
            <div className=" text-white text-3xl pb-6 pt-4 font-extrabold  w-full text-center ">
                <h2  className=" text-center mt-10">
                     ITACHI YOUTUBE DOWNLOADER
                </h2>

            </div>
            <div className="bg-white h-1">

            </div>




            <div className=" w-[768px] h-full   flex justify-start items-center flex-col p-4   relative rounded-md  "   >
                            









            
                {/* <h2 className=" text-white text-3xl pb-6 pt-4 font-extrabold bg-white w-full">
                     ITACHI YOUTUBE DOWNLOADER
                </h2> */}
                <div className="mt-8  flex justify-between  p-1 items-center ">
                    <form className="m-3"
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


                    {/* URL Button */}
                    <button
                        onClick={() => getVideoInfo(link)}
                        className="px-4 py-2 hover:bg-[#839ae5] bg-[#4050e2] text-white rounded-md font-bold  focus:outline-none"
                    >
                        Get URL
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
                                    className="px-3 py-2  text-white rounded-md font-bold hover:bg-[#839ae5] bg-[#4050e2] focus:outline-none">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>




            {/* Creadit */}
            <div className=" h-20">

            </div>
            
            <div>
            <footer class="flex flex-col items-center py-4 bg-white   ">
                <p>✔ Last update: March 2024 Update</p>
                <a href="https://github.com/pasan2002/Youtube-Video-Downloader-Extension" 
                    target="_blank" 
                    
                    title="View on Github" 
                    class="flex items-center mt-2 h-7 sm:h-9 px-2.5 text-xs sm:text-base text-white hover:bg-[#839ae5] bg-[#4050e2]  rounded">
                        <AiFillGithub/>
                        <svg class="w-5 sm:w-5 mt-0.5"  viewBox="0 0 24 24" fill="currentColor">
                        </svg>
                        <span class="ml-2 text-balance">View on Github</span>
                </a>
            </footer>
            </div>
        </div>    
    );
}
