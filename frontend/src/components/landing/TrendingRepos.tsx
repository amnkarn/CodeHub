


export default function TrendingRepos() {
    return (
        <div className="w-full pb-20 flex flex-col gap-12">
            <div className="flex flex-col gap-1.5 px-5">
                <h3 className="text-white text-2xl font-bold">Trending repositories</h3>
                <p className="text-[#7588a3] text-sm font-medium">What the community is most excited about today</p>
            </div>


            <div className="flex flex-wrap gap-4 items-center justify-between px-5">
                <Repos
                    username="sarah_codes"
                    repoName="rustl-db"
                    para="A blazing-fast embedded key-value store written in pure Rust."
                    keyword1="rust"
                    keyword2="storage"
                    keyword3="database"
                    languase="Rust"
                    star={5621}
                    forked={489}
                />
                <Repos
                    username="mia_builds"
                    repoName="ink_system"
                    para="A design system and component library built with React and Tailwind. Accessible by default."
                    keyword1="react"
                    keyword2="design-system"
                    keyword3="components"
                    languase="Typescript"
                    star={4312}
                    forked={401}
                />
                <Repos
                    username="jlin_dev"
                    repoName="pgflow"
                    para="Workflow orchestration engine that lives inside your PostgreSQL database."
                    keyword1="postgresql"
                    keyword2="workflow"
                    keyword3="go"
                    languase="Go"
                    star={3109}
                    forked={267}
                />


                <Repos
                    username="mia_builds"
                    repoName="ink_system"
                    para="A design system and component library built with React and Tailwind. Accessible by default."
                    keyword1="react"
                    keyword2="design-system"
                    keyword3="components"
                    languase="Typescript"
                    star={4312}
                    forked={401}
                />
                <Repos
                    username="sarah_codes"
                    repoName="rustl-db"
                    para="A blazing-fast embedded key-value store written in pure Rust."
                    keyword1="rust"
                    keyword2="storage"
                    keyword3="database"
                    languase="Rust"
                    star={5621}
                    forked={489}
                />
                <Repos
                    username="jlin_dev"
                    repoName="pgflow"
                    para="Workflow orchestration engine that lives inside your PostgreSQL database."
                    keyword1="postgresql"
                    keyword2="workflow"
                    keyword3="go"
                    languase="Go"
                    star={3109}
                    forked={267}
                />

                <Repos
                    username="jlin_dev"
                    repoName="pgflow"
                    para="Workflow orchestration engine that lives inside your PostgreSQL database."
                    keyword1="postgresql"
                    keyword2="workflow"
                    keyword3="go"
                    languase="Go"
                    star={3109}
                    forked={267}
                />
            </div>
        </div>
    )
}


interface Repo {
    username: string
    repoName: string
    para: string
    keyword1: string
    keyword2: string
    keyword3: string
    languase: string
    star: number
    forked: number
}

function Repos(props: Repo) {
    return (
        <div className="flex flex-col items-start py-5 px-5 h-50  bg-[#13181F] w-[32.5%] border border-gray-700 rounded-lg bg-linear-to-br font-jetBrains gap-1 group hover:outline outline-blue-500">

            <div className="flex items-center justify-between  gap-2 mb-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=devuser" alt="" className="w-6 rounded-full border border-gray-900" />
                <h5 className="text-sm text-gray-400 pt-1 group-hover:text-blue-400">{props.username}</h5>
            </div>

            <h6 className="font-mono font-semibold text-[#0da2e7] group-hover:underline">{props.repoName}</h6>

            <p className="text-sm font-inter text-gray-400 mb-3">{props.para}</p>

            <div className="flex items-center gap-2 text-xs font-semibold mb-3">
                <p className="px-2 py-0.5 bg-[#162A39] text-[#0DA2E7] rounded-full">{props.keyword1}</p>
                <p className="px-2 py-0.5 bg-[#162A39] text-[#0DA2E7] rounded-full">{props.keyword2}</p>
                <p className="px-2 py-0.5 bg-[#162A39] text-[#0DA2E7] rounded-full">{props.keyword3}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <p className="p-1 rounded-full bg-blue-400"></p>
                    <p className="text-gray-400 text-xs font-medium">{props.languase}</p>
                </div>

                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm! text-amber-300">kid_star</span>
                    <p className="text-gray-400 text-xs font-medium">{props.star}</p>
                </div>

                <div className="flex items-center gap-1 text-gray-400">
                    <i className="fa-solid fa-code-fork text-sm!"></i>
                    <p className="text-gray-400 text-xs font-medium">{props.forked}</p>
                </div>
            </div>
        </div>
    )
}