

export default function Loader() {
  return (
    <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border-10 border-t-10 border-t-red-500 rounded-full animate-spin"></div>
        <h3 className="text-3xl text-white">Loading...</h3>
      </div>
    </div>
  );
}