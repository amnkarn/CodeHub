

export default function PlatformFeatures() {
    return (
        <div className="w-full py-20 flex flex-col items-center text-center">
            <div className="flex flex-col pb-15">
                <h3 className="text-3xl font-bold tracking-tight text-white mb-3">Everything your team needs</h3>
                <p className="text-gray-500 max-w-lg">One platform to write, review, and ship code. No integrations juggling required.</p>
            </div>



            <div className="w-full flex items-center justify-between px-3 gap-2">

                <PlatformFeaturesDiv 
                    iconName="code_xml"
                    heading="Code hosting"
                    para="Host unlimited repositorie with full Git support, branch protection, and code review workflows."
                    fontColor="#00BCFF"
                    hoverBgClass= "hover:from-amber-900/40 hover:to-slate-900"
                />

                <PlatformFeaturesDiv 
                    iconName="rebase"
                    heading="Collaboration"
                    para="Work together with pull requests, inline comments, and real-time review notifications."
                    fontColor="#A684FF"
                    hoverBgClass= "hover:from-emerald-900/40 hover:to-slate-900"
                />

                <PlatformFeaturesDiv 
                    iconName="verified_user"
                    heading="Security"
                    para="Automated dependency scanning, secret detection, and vulnerability alerts baked in."
                    fontColor="#00D492"
                    hoverBgClass= "hover:from-violet-900/40 hover:to-slate-900"
                />

                <PlatformFeaturesDiv 
                    iconName="bolt"
                    heading="CI / CD"
                    para="Run pipelines on every push. Deploy anywhere. From commit to production in seconds."
                    fontColor="#FFB900"
                    hoverBgClass= "hover:from-sky-900/40 hover:to-slate-900"
                />
            </div>
        </div>
    )
}

interface Div {
    iconName: string,
    heading: string,
    para: string,
    fontColor: string
    hoverBgClass: string
}

function PlatformFeaturesDiv({ iconName, heading, para, fontColor, hoverBgClass }: Div) {
    return (
        <div className={`flex flex-col items-start justify-center px-5 h-50  bg-[#13181F] w-[25%] border border-gray-700 rounded-lg bg-linear-to-br ${hoverBgClass} `}

        >
            <div className="p-2 border border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <span className="material-symbols-outlined" style={{color: `${fontColor}`}} >
                    {iconName}
                </span>
            </div>

            <h3 className="text-white font-semibold mb-2 font-inter">{heading}</h3>
            <p className="text-sm text-gray-500 text-start font-medium"> {para} </p>
        </div>
    )
}