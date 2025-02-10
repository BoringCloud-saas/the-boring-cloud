"use client"

import { FaGoogle } from "react-icons/fa"

export default function page() {
    const handleRedirect = () => {
        window.location.href = 'http://localhost:3000/google'; // Weiterleitung zur externen URL
    };

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="flex flex-col justify-center items-center w-1/4 h-1/6 bg-[#f86c71] p-4 rounded-xl">
                <div className="flex justify-center items-center w-full">
                    <span className="text-xl font-bold text-[#fecbca]">Welcome to Boring</span>
                    <span className="text-xl ml-1 font-bold text-[#fecbca]">Cloud</span>
                </div>

                <div onClick={handleRedirect} className="flex items-center justify-center w-5/6 p-2 bg-[#fecbca] rounded-xl mt-4">
                    <FaGoogle />
                </div>

                <div className="flex items-center justify-between w-5/6 mt-3">
                    <span className="font-bold">Terms & Service</span>
                    <span className="font-bold">Our Policy</span>
                </div>
            </div>
        </div>
    )
}
