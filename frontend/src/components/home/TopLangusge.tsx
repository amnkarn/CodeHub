

export default function TopLanguages() {
    return (
        <div className="">
            <div className="text-gray-400 flex items-center pb-3 justify-between px-2">
                <h3 className=" tracking-wide font-jetBrains! uppercase">top languages</h3>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#171D26] px-4 py-4 flex flex-col gap-3">
                <Language 
                    language="TypeScript"
                    repos={4}
                    levelWidth={100}
                />
                <Language 
                    language="Rust"
                    repos={2}
                    levelWidth={50}
                />
                <Language 
                    language="Go"
                    repos={2}
                    levelWidth={50}
                />
            </div>
        </div>
    )
}

function Language({language, repos, levelWidth}: {language: string, repos: number, levelWidth: number}) {
    return (
        <div className="">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="h-2 w-2 rounded-full bg-blue-500"></p>
                    <h4 className="text-white text-[13px]!">{language}</h4>
                </div>

                <p className="text-gray-500 text-[13px]!">{repos} repos</p>
            </div>
            <div className="mt-2 w-full rounded-2xl bg-[#1F252E]">
                <div className={`w-[${levelWidth}%] h-full rounded-2xl bg-[#0DA2E7] pt-1.5`}></div>
            </div>
        </div>
    )
}