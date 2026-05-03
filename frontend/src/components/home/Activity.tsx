


export default function Activity() {
    return (
        <div className="w-full flex gap-6">
            <CommunityActivity />
            <TechOverview />
        </div>
    )
}


function CommunityActivity() {
    return (
        <div className="w-[66%]">
            <div className="text-gray-400 flex items-center justify-between px-1 pb-4">
                <div className="uppercase flex items-center gap-2 font-jetBrains-italic font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <h3 className="text-[15px] tracking-wider">community</h3>
                    <h3 className="text-[15px] tracking-wider">activity</h3>
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-[13px] ">All</p>
                    <p className="text-[13px] ">users</p>
                    <p className="w-1 h-1 bg-gray-400 rounded-full"></p>
                    <p className="text-[13px] ">live</p>
                </div>
            </div>

            <div className="rounded-xl border border-white h-20">

            </div>
        </div>
    )
}



function TechOverview() {
    return (
        <div className="flex-1">
            <div className="text-gray-400 flex items-center gap-2 px-1 pb-3">
                <span className="material-symbols-outlined text-lg!">group</span>
                <h3 className=" tracking-wider  font-jetBrains!">Developers</h3>
            </div>

            <div className="flex flex-col gap-8">
                <Developers />
                <Repos />
                <Languages />
            </div>
        </div>
    )
}


function Developers() {
    return (
            <div className="rounded-xl border border-gray-800 pt-4 flex flex-col gap-6 bg-[#171D26]">
            <Profile bottomBorder={true} />
            <Profile bottomBorder={true} />
            <Profile bottomBorder={false} />
        </div>
    )
}

function Profile({ bottomBorder }: { bottomBorder: boolean }) {
    return (
        <div className={`pb-4 px-3 ${bottomBorder ? "border-b border-gray-700" : ""}`}>
            <DeveloperImg url="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />

            <div className="">

            </div>
        </div>
    )
}

function DeveloperImg({ url }: { url: string }) {
    return (
        <div className="border w-8 h-8 rounded-full border-gray-500 bg-gray-500">
            <img src={url} alt="#profile" className="w-8 h-8 rounded-full object-cover" />
        </div>
    )
}


function Repos() {
    return (
            <div className="rounded-xl border border-gray-800 h-20 bg-[#171D26]">

        </div>
    )
}

function Languages() {
    return (
        <div className="rounded-xl border border-gray-800 h-20 bg-[#171D26]">

        </div>
    )
}