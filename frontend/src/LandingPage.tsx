

export default function LandingPage() {
    return (
        <div className="w-full ">
            <header className="w-full">
                <Navbar />
            </header>

            <main></main>

            <footer></footer>
        </div>
    )
}

function Navbar() {
    return (
        <div className="w-full h-18 flex items-center text-white justify-between bg-[#262E38]/70 backdrop-blur-md px-10">
            <div className="flex gap-3 items-center">
                <div>
                    <img src="../logo.png" alt="#logo" className="w-12 rounded-full" />
                </div>

                <Links label="Platform" />
                <Links label="Solutions" />
                <Links label="Resources" />
                <Links label="Open Source" />
                <Links label="Enterprise" />
                <Links label="Prising" />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex py-1 px-2 rounded-md border">
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" placeholder="Search or jump to..." />
                    <div className="border py-0.5 px-2 rounded-md text-xs">/</div>
                </div>

                <div>Sign in</div>
                <div className="px-2.5 py-1.5 rounded-md border">Sign up</div>
            </div>
        </div>
    )
}



function Links({label, onClick}: {label: string, onClick?: () => void}) {
    return (
        <div className="flex items-center text-[17px]" onClick={onClick}>
                    <h4>{label}</h4>
                    <span className="material-symbols-outlined">stat_minus_1</span>
                </div>
    )
}