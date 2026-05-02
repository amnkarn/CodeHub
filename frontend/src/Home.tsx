import Navbar from "./components/home/Navbar";
import Activity from "./components/home/Activity";


export default function Home() {
    return (
        <div className="w-full bg-[#11161D] h-250">
            <header className="w-full fixed">
                <Navbar />
            </header>

            <main className="px-50 pt-16">
                <Activity />
            </main>

            <footer></footer>
        </div>
    )
}