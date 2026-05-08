import Footer from "../components/landing/Footer";
import FooterBottom from "../components/landing/FooterBottom";
import HeroSection from "../components/landing/HeroSection";
import Insights from "../components/landing/Insights";
import Navbar from "../components/Navbar";
import PlatformFeatures from "./PlatformFeatures";


export default function LandingPage() {
    return (
        <div className="w-full bg-[#11161D]">
            <header className="w-full">
                <Navbar />
            </header>

            <main className="w-full ">
                <HeroSection />
                <Insights />
                <PlatformFeatures />
            </main>

            <footer>
                <Footer />
                <FooterBottom />
            </footer>
        </div>
    )
}