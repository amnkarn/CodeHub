


export default function CommunityActivity() {
    return (
        <div className="w-[66%] pb-15">
            <CommunityActivityHeader />

            <div className="rounded-xl border bg-[#181E27] border-gray-800 pt-3 flex flex-col gap-4">
                <DevActivity 
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    username="devuser"
                    activityType='push'
                    repo="devuser/nexus-framework"
                    time="5 days ago"
                    description="Pushed 3 commits to main: Add route middleware, Fix CORS headers, Update docs"
                />
                <DevActivity 
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                    username="sarah_codes"
                    activityType='open issue'
                    repo="devuser/nexus-framework"
                    time="5 days ago"
                    description="Opened issue #1: Add support for middleware chaining"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia"
                    username="mia_builds"
                    activityType='star'
                    repo="sarah_codes/rustl-db"
                    time="5 days ago"
                    description="Starred sarah_codes/rustl-db"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                    username="sarah_codes"
                    activityType='push'
                    repo="sarah_codes/rustl-db"
                    time="5 days ago"
                    description="Pushed 5 commits to main: WASM target initial work, Fix snapshot isolation"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=James"
                    username="jlin_dev"
                    activityType='open issue'
                    repo="sarah_codes/rustl-db"
                    time="5 days ago"
                    description="Opened issue #2: Snapshot isolation not working correctly"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    username="devuser"
                    activityType='fork'
                    repo="mia_builds/ink-system"
                    time="5 days ago"
                    description="Forked mia_builds/ink-system"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia"
                    username="mia_builds"
                    activityType='open pr'
                    repo="mia_builds/ink-system"
                    time="5 days ago"
                    description="Opened PR #14: Add dark mode tokens for all semantic colors"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=James"
                    username="jlin_dev"
                    activityType='push'
                    repo="jlin_dev/pgflow"
                    time="5 days ago"
                    description="Pushed 2 commits to main: Add JSON column support draft, Improve worker pool"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    username="devuser"
                    activityType='open issue'
                    repo="mia_builds/ink-system"
                    time="5 days ago"
                    description="Opened issue #1: Dark mode tokens"
                />
                <DevActivity
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia"
                    username="mia_builds"
                    activityType='close issue'
                    repo="mia_builds/ink-system"
                    time="5 days ago"
                    description="Closed issue #2: Tooltip accessibility fix"
                    bb={false}
                />
            </div>
        </div>
    )
}

function CommunityActivityHeader() {
    return (
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
    )
}


interface User {
    img: string,
    username: string,
    activityType: 'push' | 'open issue' | 'close issue' | 'star' | 'fork' | 'open pr' | 'close pr',
    repo: string,
    time: string,
    description: string
    bb?: boolean,
}

function DevActivity({ bb = true, ...props }: User) {
    return (
        <div className={`px-5 ${bb && 'border-b border-gray-700'} pb-5 flex flex-col gap-3`}>
            <div className="flex items-center gap-3 pb-1">
                <DeveloperImg url={props.img} />

                <div className="flex items-center gap-1.5">
                    <h3 className="text-white text-sm font-medium">{props.username}</h3>
                    <p className="text-gray-400 text-sm">
                        {props.activityType === 'push' && "pushed to"}
                        {props.activityType === 'open issue' && "opened issue in"}
                        {props.activityType === "close issue" && "closed issue in"}

                        {props.activityType === 'star' && "starred"}
                        {props.activityType === 'fork' && "forked"}
                        {props.activityType === 'open pr' && "opened pr in"}
                        {props.activityType === 'close pr' && "closed pr in"}
                    </p>
                    <p className="text-blue-500">{props.repo}</p>
                </div>
            </div>

            <div className="w-full pb-4 border-b border-x border-gray-600 rounded-b-xl px-4 flex flex-col gap-1">
                <p className="text-blue-500">{props.repo}</p>
                <p className="text-gray-400 text-[13px]">{props.description}</p>
                <p className="text-gray-400 text-[13px]">{props.time}</p>
            </div>
        </div>
    )
}

function DeveloperImg({ url }: { url: string }) {
    return (
        <div className="border w-9 h-9 mt-1 ml-1.5 rounded-full bg-gray-900">
            <img src={url} alt="#profile" className="w-9 h-9 rounded-full object-cover" />
        </div>
    )
}