import Activity from "./components/home/Activity";
import Navbar from "./components/home/Navbar";
import Overview from "./components/home/Overview";


export default function Home() {
    return (
        <div className="w-full bg-[#11161D] h-250 font-inter">
            <header className="w-full fixed">
                <Navbar />
            </header>

            <main className="px-50 pt-16">
                <Overview />
                <Activity />
            </main>

            <footer></footer>
        </div>
    )
}