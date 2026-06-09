import type { JSX } from "react"
import Issue from "../../assets/icons/Issue"
import ProfileImg from "../../assets/icons/ProfileImg"
import { useNavigate } from "react-router-dom"


export default function ProfilePageNavbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-16 flex items-center text-white justify-between bg-[#151B25] backdrop-blur-md px-5 border-b border-gray-700">
            <div className="flex items-center gap-10">
                <div className="flex gap-3 pl-5 items-center">
                    <div>
                        <img src="../logo.png" alt="#logo" className="w-12 rounded-full" />
                    </div>
                    <h3 className=" font-medium">Dashboard</h3>
                </div>

                <div className="flex py-1 pl-2 pr-8 rounded-md border border-gray-600 items-center opacity-60 active:opacity-100" onClick={() => { }}>
                    <span className="material-symbols-outlined">search</span>
                    <span className="flex items-center gap-1 font-xs font-normal">
                        Type
                        <div className="border py-0.5 px-2 rounded-md text-xs">/</div>
                        to search
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <NavElem 
                    name={"Dashboard"} 
                    icon={<i className="fa-regular fa-house"></i>} 
                    onClick={() => navigate("/home")}
                />
                <NavElem 
                    name={"Issues"} 
                    icon={<Issue />}
                    onClick={() => navigate("/issues")}
                />
                <NavElem 
                    name={"Profile"} 
                    icon={<ProfileImg />}
                    onClick={() => navigate("/me")}
                />
            </div>
        </div>
    )
}

function NavElem({name, icon, onClick}: {name: string, icon: JSX.Element, onClick?: () => void}) {
    return (
        <div className="hover:border border-gray-600 rounded-md py-2 gap-2 px-2 flex items-center opacity-60 hover:opacity-85 cursor-pointer text-sm hover:bg-[#142938] hover:text-[#0DA2E7]" onClick={onClick}>
            <span>{icon}</span>
            <span>{name}</span>
        </div>
    )
}