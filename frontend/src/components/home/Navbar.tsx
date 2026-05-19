import { useState, type JSX } from "react";
import NewAdd from "../../assets/icons/New";
import Issue from "../../assets/icons/Issue";
import Pull from "../../assets/icons/Pull";
import Repos from "../../assets/icons/Repos";
import Notification from "../../assets/icons/Notifications";
import ProfileImg from "./ProfileImg";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
    const [openSearchBox, setOpenSearchBox] = useState(false);
    const [lgtModal, setLgtModal] = useState(false);
    const { loading } = useAuth();


    if (openSearchBox) {
        return (
            <OpenSearchBox />
        )
    }

    function changeState() {
        //console.log("modal triggered");
        setLgtModal(prev => !prev);
    }
    
    if(loading) {
        return (
            <Loader />
        )
    }

    return (
        <div className="w-full h-16 flex items-center text-white justify-between bg-[#151B25] backdrop-blur-md px-5 border-b border-gray-700">
            <div className="flex gap-3 pl-5 items-center">
                <div>
                    <img src="../logo.png" alt="#logo" className="w-12 rounded-full" />
                </div>
                <h3 className=" font-medium">Dashboard</h3>
            </div>


            <div className="flex items-center gap-3">
                <div className="flex py-1 pl-2 pr-8 rounded-md border border-gray-600 items-center opacity-60 active:opacity-100" onClick={() => setOpenSearchBox(true)}>
                    <span className="material-symbols-outlined">search</span>

                    <span className="flex items-center gap-1 font-xs font-normal">
                        Type
                        <div className="border py-0.5 px-2 rounded-md text-xs">/</div>
                        to search
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="rounded-md py-0.5 gap-1 px-2 border border-gray-600 flex items-center opacity-60 hover:opacity-85 cursor-pointer">
                        <NewAdd />
                        <span className="material-symbols-outlined text-xl!">arrow_drop_down</span>
                    </div>

                    <NavIconTemp icon={<Issue />} />

                    <NavIconTemp icon={<Pull />} />

                    <NavIconTemp icon={<Repos />} />

                    <NavIconTemp icon={<Notification />} />

                    {/* require img and onClick */}
                    <div className="relative">
                        <ProfileImg onClick={changeState} />
                        { lgtModal && <ProfileModal /> }
                    </div>
                </div>
            </div>
        </div>
    )
}

function NavIconTemp({icon}: {icon: JSX.Element}) {
    return (
        <div className="border border-gray-600 rounded-md py-2 gap-1 px-2 flex items-center opacity-60 hover:opacity-85 cursor-pointer">
            { icon }
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


function ProfileModal() {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    async function logoutReq() {
        const success = await handleLogout();
        if(success) {
            navigate("/");
        }
    }

    function profileReq() {
        navigate("/me")
    }

    return (
        <div className="absolute top-12 -right-2 flex flex-col items-center gap-2 bg-[#151B25] border border-zinc-500 px-5 py-5 rounded-lg">

            <ModalLabels 
                label="Profile"
                icon={<i className="fa-regular fa-user"></i>}
                onClick={profileReq}
            />

            <ModalLabels 
                label="logout"
                icon={<i className="fa-solid fa-arrow-right-from-bracket"></i>}
                onClick={logoutReq}
            />
        </div>
    )
}

interface Label {
    label: string
    icon: React.ReactNode
    onClick?: () => void
}

function ModalLabels({label, icon, onClick}: Label) {
    return (
        <div className="flex items-center gap-3 text-gray-400 font-medium hover:text-white cursor-pointer hover:border-blue-400 text-[17px]" onClick={onClick} >
            <p>{label}</p>
            {icon}
        </div>
    )
}