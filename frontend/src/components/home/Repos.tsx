

export default function Repos() {
    return (
        <div className="flex flex-col">
            <div className="text-gray-400 flex items-center pb-3 justify-between px-2">
                <h3 className=" tracking-wide font-jetBrains! uppercase">Your Repos</h3>
                <a href="" className="text-blue-500 text-[13px]">View all</a>
            </div>

            <div className="flex flex-col gap-2">
            <Repo 
                heading="nexus-framework"
                description="A lightweight, high-performance web framework for..."
                language="TypeScript"
                star={2847}
                forks={312}
            />

            <Repo 
                heading="data-forge"
                description="Transform, validate, and pipeline your data with an el..."
                language="TypeScript"
                star={934}
                forks={87}
            />
            </div>
        </div>
    )
}

interface RepoData {
    heading: string,
    description: string,
    language: string,
    star: number,
    forks: number
}

function Repo(props: RepoData) {
    return (
        <div className="rounded-xl border border-gray-800 bg-[#171D26] flex flex-col px-3 py-2 gap-1">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg! text-gray-300">language</span>
                <h4 className="hover:underline font-bold text-sm text-blue-400 cursor-pointer">{props.heading}</h4>
            </div>

            <p className="text-xs text-zinc-400 pl-1 font-semibold">{props.description}</p>

            <div className="flex items-center text-zinc-400 gap-4">
                <div className="flex items-center gap-2">
                    <p className="w-2 h-2 bg-blue-500 rounded-full"></p>
                    <p className="text-xs">{props.language}</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm! text-yellow-400">kid_star</span>
                    <p className="text-xs">{props.star}</p>
                </div>

                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-code-fork text-xs!"></i>
                    <p className="text-xs">{props.forks}</p>
                </div>
            </div>
        </div>
    )
}