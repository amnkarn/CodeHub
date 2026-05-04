import CommunityActivity from "./CommunityActivity"
import TechOverview from "./TechOverview"



export default function Activity() {
    return (
        <div className="w-full flex gap-6">
            <CommunityActivity />
            <TechOverview />
        </div>
    )
}