

export default function Footer() {
    return (
        <div className="w-full flex flex-col items-center gap-5 py-30 bg-linear-to-tr from-sky-900/40 hover:to-slate-900">
            <h1 className="text-white text-4xl font-bold">Ready to start building?</h1>
            <p className="text-gray-500 font-medium">Join developers shipping faster with CodeHub. Your next great project starts here.</p>
            
            <button className="flex items-center gap-1 px-10 py-2.5 rounded-md bg-[#0DA2E7] font-medium">
                <p className="">Get Started</p>
                <span className="material-symbols-outlined text-[18px]!">arrow_forward</span>
            </button>
        </div>
    )
}