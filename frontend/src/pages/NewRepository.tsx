import Navbar from "../components/home/Navbar";

export default function NewRepository() {
    return (
        <div className="w-full bg-[#11161D] font-inter">
            <header className="w-full fixed">
                <Navbar />
            </header>

            <main className="px-50 pt-24">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-semibold text-white mb-6">New Repository</h1>
                    
                    <div className="bg-[#151B25] border border-gray-700 rounded-lg p-6">
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-2">Repository name</label>
                            <input 
                                type="text" 
                                placeholder="my-awesome-repo"
                                className="w-full bg-[#11161D] border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-2">Description</label>
                            <textarea 
                                placeholder="Optional description"
                                rows={4}
                                className="w-full bg-[#11161D] border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">Public repository</span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
                                Create repository
                            </button>
                            <button className="border border-gray-600 text-gray-300 hover:border-gray-500 px-4 py-2 rounded-md font-medium">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
