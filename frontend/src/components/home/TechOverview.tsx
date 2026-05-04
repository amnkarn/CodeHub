import Developers from "./DevloperProfile"
import Repos from "./Repos"
import TopLanguages from "./TopLangusge"


export default 
function TechOverview() {
    return (
        <div className="flex-1 pb-10">
            <div className="text-gray-400 flex items-center gap-2 px-1 pb-3">
                <span className="material-symbols-outlined text-lg!">group</span>
                <h3 className=" tracking-wider  font-jetBrains!">Developers</h3>
            </div>

            <div className="flex flex-col gap-6">
                <Developers />
                <Repos />
                <TopLanguages />
            </div>
        </div>
    )
}