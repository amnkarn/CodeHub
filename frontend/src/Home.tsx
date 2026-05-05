import Activity from "./components/home/Activity";
import Navbar from "./components/home/Navbar";
import Overview from "./components/home/Overview";


export default function Home() {
    return (
        <div className="w-full bg-[#11161D] font-inter">
            <header className="w-full fixed">
                <Navbar />
            </header>

            <main className="px-50 pt-16">
                <Overview />
                <Activity />
            </main>

            <footer className="mb-0">
                <Footer />
            </footer>
        </div>
    )
}


function Footer() {
    return (
        <div className="flex items-center text-gray-400 px-50 pb-10 text-[13px] gap-30">
            <div className="flex items-center gap-3 pl-5">
                <img src="../logo.png" alt="#logo" className="w-10 rounded-full" />
                &copy; 2026 CodeHub, Inc.
            </div>
            
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-4">
                    <p className="hover:underline hover:text-white cursor-pointer">Terms</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Privacy</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Security</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Status</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Community</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Docs</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Contact</p>
                    <p className="hover:underline hover:text-white cursor-pointer">Manage Cookies</p>
                </div>
                <p>Do not share my personal information</p>
            </div>
        </div>
    )
}