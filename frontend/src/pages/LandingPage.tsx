import HeroSection from "../components/landing/HeroSection";
import Insights from "../components/landing/Insights";
import Navbar from "../components/Navbar";


export default function LandingPage() {
    return (
        <div className="w-full bg-[#11161D]">
            <header className="w-full">
                <Navbar />
            </header>

            <main className="w-full ">
                <HeroSection />
                <Insights />
                {/*<PlatformFeatures />*/}
            </main>

            <footer></footer>
        </div>
    )
}


//function PlatformFeatures() {
//    return (
//        <div className="w-full my-20">
//            <div className="flex flex-col">
//                <h3 className="text-3xl text-white">Everything your team needs</h3>
//                <p className="text-gray-400">One platform to write, review, and ship code. No integrations juggling required.</p>
//            </div>

//            <div></div>
//        </div>
//    )
//}