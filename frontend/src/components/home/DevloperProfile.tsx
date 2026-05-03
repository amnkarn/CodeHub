

export default function Developers() {
    return (
        <div className="rounded-xl border border-gray-800 pt-4 flex flex-col gap-6 bg-[#171D26]">
            <Profile
                bottomBorder={true}
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                name="Alex Chen"
                username="@devuser"
                reposCount="12"
            />

            <Profile
                bottomBorder={true}
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                name="Sarah Ockonwo"
                username="@sarah_codes"
                reposCount="24"
            />

            <Profile
                bottomBorder={true}
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=James"
                name="James Lin"
                username="@jlin_dev"
                reposCount="9"
            />

            <Profile
                bottomBorder={false}
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=Mi"
                name="Mia Rodreguez"
                username="@mis_builds"
                reposCount="18"
            />
        </div>
    )
}

interface ProfileProps {
    bottomBorder: boolean,
    img: string,
    name: string,
    username: string,
    reposCount: string
}

function Profile(props: ProfileProps) {
    return (
        <div className={`pb-4 px-3 flex items-center ${props.bottomBorder ? "border-b border-gray-700" : ""}`}>
            <DeveloperImg url={props.img} />

            <div className="flex flex-col px-4">
                <h3 className="text-white text-sm font-medium">{props.name}</h3>

                <div className="flex items-center text-xs font-medium text-gray-400 gap-3">
                    <p>{props.username}</p>
                    <p className="w-0.5 h-0.5 rounded-full bg-gray-400"></p>
                    <p>{props.reposCount} repos</p>
                </div>
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
