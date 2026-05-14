

export default function FooterBottom() {
    return (
        <div className="flex items-center justify-between py-4 px-5 bg-[#0F273A]">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-950">
                <img src="../logo.png" alt="#logo" className="w-12 rounded-full" />
                <p className="text-white text-lg font-semibold">CodeHub</p>
            </div>

            <p className="text-gray-400 font-semibold">The home for open source code</p>
        </div>
    )
}