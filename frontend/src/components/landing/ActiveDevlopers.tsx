


export default function ActiveDevelopers() {
    return (
        <div className="w-full font-inter pb-20 flex flex-col gap-8">
            <div className="flex items-center justify-between px-6">
                
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-white text-2xl font-bold">Active developers</h3>
                    <p className="text-[#7588a3] text-sm font-medium">Join the community already building on CodeHub</p>
                </div>

                <div className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg text-gray-300
                 text-sm font-medium gap-1 cursor-pointer">
                    View all
                    <span className="material-symbols-outlined text-sm! font-semibold!">arrow_forward</span>
                </div>
            </div>

            <div className="flex items-center justify-between px-5">
                <ActiveDeveloperProfile 
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    name="Alex Chen"
                    username="@devuser"
                    follower={342}
                    repos={12}
                />

                <ActiveDeveloperProfile 
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                    name="Sarah Okonkow"
                    username="@sarah_codes"
                    follower={891}
                    repos={24}
                />

                <ActiveDeveloperProfile 
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=James"
                    name="James Lin"
                    username="@jlin_dev"
                    follower={213}
                    repos={9}
                />

                <ActiveDeveloperProfile 
                    img="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia"
                    name="Mia Rodriguez"
                    username="@mia_builds"
                    follower={567}
                    repos={18}
                />
            </div>
        </div>
    )
}


interface User {
    img: string,
    name: string,
    username: string,
    follower: number,
    repos: number
}

function ActiveDeveloperProfile({ img, name, username, follower, repos }: User) {
    return (
        <div className="flex flex-col items-start justify-center px-5 h-25  bg-[#13181F] w-[24%] border border-gray-700 rounded-lg font-jetBrains gap-3 group group hover::outline-1 outline-blue-400 cursor-pointer">
                    <div className="font-inter flex items-center gap-5">
                        <img src={img} alt="" className="w-10 rounded-full border border-gray-900"/>

                        <div className="flex flex-col ">
                            <h4 className="text-white text-sm group-hover:text-blue-400 font-medium">{name}</h4>
                            <p className="text-gray-400 text-xs">{username}</p>
                        </div>
                    </div>

                    <div className="text-gray-400 flex items-center gap-2 text-sm">
                        <span className="text-white">{follower}</span> followers
                        <span className="text-white">{repos}</span> repos
                    </div>
                </div>
    )
}