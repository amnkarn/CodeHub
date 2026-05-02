import { useState } from "react";
import NewAdd from "../../assets/icons/New";
import Issue from "../../assets/icons/Issue";
import Pull from "../../assets/icons/Pull";
import Repos from "../../assets/icons/Repos";
import Notification from "../../assets/icons/Notifications";
import ProfileImg from "./ProfileImg";



export default function Navbar() {
    const [openSearchBox, setOpenSearchBox] = useState(false);

    if (openSearchBox) {
        return (
            <OpenSearchBox />
        )
    }

    return (
        <div className="w-full h-16 flex items-center text-white justify-between bg-[#151B25] backdrop-blur-md px-5 border-b border-gray-400">
            <div className="flex gap-3 pl-5 items-center">
                <div>
                    <img src="../logo.png" alt="#logo" className="w-12 rounded-full" />
                </div>
                <h3 className=" font-medium">Dashboard</h3>
            </div>


            <div className="flex items-center gap-3">
                <div className="flex py-1 pl-2 pr-8 rounded-md border items-center" onClick={() => setOpenSearchBox(true)}>
                    <span className="material-symbols-outlined">search</span>

                    <span className="flex items-center gap-1 font-xs font-normal">
                        Type
                        <div className="border py-0.5 px-2 rounded-md text-xs">/</div>
                        to search
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="border rounded-md py-0.5 gap-1 px-2 border-white flex items-center">
                        <NewAdd />
                        <span className="material-symbols-outlined text-xl!">arrow_drop_down</span>
                    </div>
                    <div className="border rounded-md py-2 gap-1 px-2 border-white flex items-center">
                        <Issue />
                    </div>
                    <div className="border rounded-md py-2 gap-1 px-2 border-white flex items-center">
                        <Pull />
                    </div>

                    <div className="border rounded-md py-2 gap-1 px-2 border-white flex items-center">
                        <Repos />
                    </div>

                    <div className="border rounded-md py-2 gap-1 px-2 border-white flex items-center">
                        <Notification />
                    </div>

                    {/* require img and onClick */}
                    <ProfileImg />
                </div>
            </div>
        </div>
    )
}


function OpenSearchBox() {
    return (
        <div className="w-full border-2 border-red-500">
            <div>
                <span className="material-symbols-outlined">search</span>
                <input
                    type="text"
                    placeholder="Search or jump to..."
                    className="pr-20 outline-0"
                />

            </div>
        </div>
    )
}