import TechOverview from "./TechOverview"



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