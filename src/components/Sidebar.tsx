import avatar from "../assets/images/profile.jpg"

const Sidebar = () => {
  return (
    <div className="w-[250px] min-h-screen bg-slate-800 text-white p-4 rounded-r-3xl shadow-xl flex flex-col items-center space-y-4">
      <img src={avatar} className="w-24 h-24 rounded-full" alt="avatar" />
      <div className="text-center">
        <h2 className="text-lg font-bold">Amamiya (Maireza)</h2>
        <p className="text-sm text-gray-300">A.I Engineer</p>
      </div>
      <div className="text-sm w-full space-y-2">
        <p>@_amamiya___stargazer__</p>
        <p>📘 Amamiya</p>
        <p>🧠 Amamiyakun02</p>
        <p>🔗 <a href="#" className="underline">linkedin.com/in/m-maireza</a></p>
        <p className="text-xs text-gray-400">+6283863540720 or talk directly to my <span className="underline">AI Assistant</span>.</p>
      </div>
    </div>
  )
}

export default Sidebar
