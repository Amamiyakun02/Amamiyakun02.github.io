import { Github, Instagram, Linkedin, MessageSquare, ShieldAlert, Cpu, X } from "lucide-react"
import avatar from "../assets/images/profile.jpg"
import { useApp } from "../context/AppContext"

type SidebarProps = {
  isDrawer?: boolean
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar = ({ isDrawer, isOpen = true, onClose }: SidebarProps) => {
  const { t } = useApp()

  return (
    <div className={`${
      isDrawer
        ? "relative w-full h-full p-6 flex flex-col items-center select-none bg-slate-950/95 backdrop-blur-2xl border-r border-white/10"
        : `hidden lg:flex bg-slate-950/50 border-r border-white/[0.04] flex-col items-center flex-shrink-0 select-none glass-sidebar transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] will-change-[width,opacity] ${
            isOpen ? "w-[320px] opacity-100" : "w-0 border-r-transparent opacity-0 overflow-hidden"
          }`
    }`}>
      
      {/* Close button for mobile drawer */}
      {isDrawer && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white rounded-full transition z-50 flex items-center justify-center"
          title="Close profile panel"
        >
          <X size={14} />
        </button>
      )}
      
      {/* Inner wrapper: handles padding inside desktop mode, and stays completely static to prevent text/layout reflow */}
      <div className={`flex flex-col items-center h-full flex-shrink-0 will-change-transform ${
        isDrawer ? "w-full" : "w-[320px] p-8"
      }`}>
        
        {/* Profile Photo with interactive neon pulse border */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-40 group-hover:opacity-85 transition duration-500 group-hover:duration-200 animate-pulse" />
          <div className="relative w-[150px] h-[150px] lg:w-[170px] lg:h-[170px] rounded-full overflow-hidden border border-white/20 bg-slate-950">
            <img
              src={avatar}
              alt="Amamiya Profile"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
            />
          </div>
          <div className="absolute bottom-1 right-2 bg-emerald-500 text-white rounded-full p-1.5 border-2 border-slate-950 shadow-lg" title="System Status: Online">
            <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping absolute" />
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full relative" />
          </div>
        </div>

        {/* Profile Details */}
        <div className="text-center mt-5 w-full">
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-wide group-hover:text-blue-400 transition">
            {t("sidebarName")}
          </h2>
          
          {/* Core Tag */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full mt-2">
            <Cpu size={12} className="animate-spin-slow" />
            <span>{t("sidebarRole")}</span>
          </div>
          
          <p className="text-xs text-slate-400 mt-3 max-w-[240px] mx-auto leading-relaxed">
            {t("sidebarDesc")}
          </p>
        </div>

        {/* Tech Badges List */}
        <div className="w-full mt-6 border-t border-white/[0.04] pt-5">
          <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 mb-3 text-center lg:text-left">{t("sidebarModules")}</h4>
          <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
            {["Python", "React", "Linux Admin", "Bash", "Flutter", "AI Agent"].map((badge, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold bg-slate-900/60 border border-white/[0.03] text-slate-400 px-2 py-0.5 rounded-md hover:border-blue-500/25 hover:text-white transition duration-200 cursor-default"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Social Handshakes */}
        <div className="w-full mt-6 border-t border-white/[0.04] pt-5 flex flex-col items-center">
          <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 mb-3 text-center lg:text-left w-full">{t("sidebarNetwork")}</h4>
          <div className="flex gap-2.5 justify-center">
            <a
              href="https://wa.me/6283863450720"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-900/50 hover:bg-green-500/10 border border-white/[0.04] hover:border-green-500/20 text-slate-400 hover:text-green-400 rounded-xl hover:-translate-y-1 transition duration-300 shadow"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={16} />
            </a>
            <a
              href="https://instagram.com/_amamiya___stargazer__"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-900/50 hover:bg-pink-500/10 border border-white/[0.04] hover:border-pink-500/20 text-slate-400 hover:text-pink-400 rounded-xl hover:-translate-y-1 transition duration-300 shadow"
              title="Follow on Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://github.com/Amamiyakun02"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-900/50 hover:bg-white/10 border border-white/[0.04] hover:border-white/20 text-slate-400 hover:text-white rounded-xl hover:-translate-y-1 transition duration-300 shadow"
              title="Explore GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/m-maireza"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-900/50 hover:bg-blue-500/10 border border-white/[0.04] hover:border-blue-500/20 text-slate-400 hover:text-blue-400 rounded-xl hover:-translate-y-1 transition duration-300 shadow"
              title="Connect on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Footer System Status */}
        <div className="mt-auto pt-6 text-[10px] font-mono text-slate-600 flex items-center gap-1 w-full justify-center">
          <ShieldAlert size={12} className="text-slate-600" />
          <span>{t("sidebarSecure")}</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
