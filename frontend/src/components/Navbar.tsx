import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Navbar() {
    const [openSearchBox, setOpenSearchBox] = useState(false);
    const navigate = useNavigate();

    if (openSearchBox) {
        return (
            <OpenSearchBox />
        )
    }

    return (
        <div className="w-full h-18 flex items-center text-gray-300 justify-between bg-[#151B25]/90 backdrop-blur-md px-10">
            <div className="flex gap-3 items-center">
                <div>
                    <img src="../logo.png" alt="#logo" className="w-12 rounded-full" />
                </div>

                <Links label="Platform" onClick={() => navigate("/")}/>
                <Links label="Solutions" />
                <Links label="Resources" />
                <Links label="Open Source" />
                <Links label="Enterprise" />
                <Links label="Prising" />
            </div>

            <div className="flex items-center gap-5">
                <div className="flex py-1 px-2 rounded-md border">
                    <span className="material-symbols-outlined">search</span>
                    <input
                        type="text"
                        placeholder="Search or jump to..."
                        className="pr-20 outline-0"
                        onClick={() => setOpenSearchBox(true)}
                    />
                    <div className="border py-0.5 px-2 rounded-md text-xs">/</div>
                </div>

                <NavButton label="Sign in" onClick={() => navigate("/login")} />
                <NavButton label="Sign up" onClick={() => navigate("/register")} outline={true} />
            </div>
        </div>
    )
}

function NavButton({ label, onClick, outline }: { label: string, onClick: () => void, outline?: boolean }) {
    return (
        <div className={`px-2.5 py-1.5 rounded-md ${outline ? 'outline' : ''} transition-all hover:outline-2 cursor-pointer`} onClick={onClick} >
            {label}
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


function Links({ label, onClick }: { label: string, onClick?: () => void }) {
    return (
        <div className="flex items-center text-[17px] cursor-pointer" onClick={onClick}>
            <h4>{label}</h4>
            <span className="material-symbols-outlined">stat_minus_1</span>
        </div>
    )
}