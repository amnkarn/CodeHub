

export default function Insights() {
    return (
        <div className="w-full flex items-center justify-between border-y border-gray-800 py-12 ">
            <InsightDiv 
                iconName="group"
                heading="4M+"
                para="Developers"
            />
            <InsightDiv 
                iconName="import_contacts"
                heading="120M+"
                para="Repositories"
            />
            <InsightDiv 
                iconName="language"
                heading="190+"
                para="Contries"
            />
            <InsightDiv 
                iconName="rebase"
                heading="2.5B+"
                para="Daily commits"
            />
        </div>
    )
}

function InsightDiv({ iconName, heading, para }: { iconName: string, heading: string, para: string }) {
    return (
        <div className="flex flex-col items-center gap-1 px-5 py-7  bg-[#13181F] w-[25%] border-r border-gray-700">
            <span className="material-symbols-outlined text-[#0DA2E7]">{iconName}</span>

            <h3 className="text-white text-3xl font-bold font-mono">{heading}</h3>
            <p className="text-gray-400">{para}</p>
        </div>
    )
}