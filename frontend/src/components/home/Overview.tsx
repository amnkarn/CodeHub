import type { ReactNode } from "react"


export default function Overview() {
    return (
        <div className="w-full pt-6">
            <div className="text-white">
                <h3 className="text-2xl font-bold">Dashboard</h3>
                <p className="text-gray-500 pt-1 font-jetBrains-italic font-medium!">Platform-wide overview and live community activity</p>
            </div>

            <div className="flex gap-3 py-8">
                <ActivityBox 
                    icon={<span className="material-symbols-outlined">import_contacts</span>} 
                    label="Repositories"
                    value="8"
                    fontColor="#00BCFF"
                    fontBgColor="#152B3A"
                />
                <ActivityBox 
                    icon={<span className="material-symbols-outlined">kid_star</span>} 
                    label="Total Stars"
                    value="20,685"
                    fontColor="#E3B404"
                    fontBgColor="#2D2C22"
                />
                <ActivityBox 
                    icon={<span className="material-symbols-outlined">error</span>} 
                    label="Open Issues"
                    value="6"
                    fontColor="#FF6467"
                    fontBgColor="#2E1E27"
                />

                <ActivityBox 
                    icon={<i className="fa-solid fa-code-fork"></i>} 
                    label="Total Forks"
                    value="1,851"
                    fontColor="#A684FF"
                    fontBgColor="#23223C"
                />

                <ActivityBox 
                    icon={<i className="fa-solid fa-fire-flame-curved"></i>} 
                    label="Streak"
                    value="7d"
                    fontColor="#FF8904"
                    fontBgColor="#2F2422"
                />
            </div>
        </div>
    )
}


interface Activity {
    icon: ReactNode
    label: string
    value: string
    fontColor: string
    fontBgColor: string
}

function ActivityBox({icon, label, value, fontColor, fontBgColor}: Activity) {
    return (
        <div className="flex flex-col h-35 w-55 items-start justify-between pl-4 pr-32 py-4 rounded-xl bg-[#171D26] border border-gray-700">
            <div 
                className="border border-gray-800 px-1.5 pt-1 rounded-md flex items-center justify-center"
                style={{backgroundColor: fontBgColor}}
            >
                <p className="text-white" style={{color: fontColor}}> {icon} </p>
            </div>
            <h3 className="text-white text-2xl font-bold font-jetBrains-italic"> {value} </h3>

            <p className="text-gray-400 text-xs"> {label} </p>
        </div>
    )
}