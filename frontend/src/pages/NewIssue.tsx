import Navbar from "../components/home/Navbar";

export default function NewIssue() {
    return (
        <div className="w-full bg-[#11161D] font-inter">
            <header className="w-full fixed">
                <Navbar />
            </header>

            <main className="px-50 pt-24">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-semibold text-white mb-6">New Issue</h1>
                    
                    <div className="bg-[#151B25] border border-gray-700 rounded-lg p-6">
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-2">Title</label>
                            <input 
                                type="text" 
                                placeholder="Issue title"
                                className="w-full bg-[#11161D] border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-2">Description</label>
                            <textarea 
                                placeholder="Describe the issue..."
                                rows={10}
                                className="w-full bg-[#11161D] border border-gray-700 rounded-md px-4 py-2 text-white outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
                                Submit new issue
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
