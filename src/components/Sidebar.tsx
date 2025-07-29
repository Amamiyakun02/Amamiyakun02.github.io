// src/components/Sidebar.tsx
const Sidebar = () => {
  return (
    <div className="w-[260px] min-h-screen bg-slate-800 text-white p-4 rounded-r-3xl shadow-xl">
      {/* Profil dan sosial media */}
      <div className="text-center">
        <img src="/avatar.png" alt="avatar" className="w-24 h-24 mx-auto rounded-full" />
        <h2 className="mt-2 font-bold">Amamiya (Meizora)</h2>
        <p className="text-sm text-gray-400">AI Engineer</p>
      </div>
      {/* Kontak atau link sosmed */}
      <div className="mt-4 space-y-2 text-sm">
        <div>@_amamiya__</div>
        <div>@Kanzaki</div>
        <div>kanzaki@email</div>
        <div className="text-xs text-gray-500">bisa hubungi saya via Assistant</div>
      </div>
    </div>
  )
}

export default Sidebar
