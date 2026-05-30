import { Link } from "react-router-dom"
import { Briefcase, Bot, Cpu, Terminal, ArrowRight, Download } from "lucide-react"
import { useApp } from "../context/AppContext"

const Home = () => {
  const { t, language } = useApp()

  return (
    <div className="w-full min-h-0 h-full flex flex-col justify-center items-start p-6 md:p-10 text-slate-100">
      
      {/* System Classification Banner */}
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] uppercase font-bold tracking-widest animate-pulse mb-4 select-none">
        <Cpu size={12} />
        <span>System handshake: SECURE (127.0.0.1)</span>
      </div>

      {/* Main Greeting with dynamic typing-style text */}
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
          {t("homeIntro")} <br className="md:hidden" />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent ml-1">
            Amamiya
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-400 mt-4 font-semibold leading-relaxed">
          {t("homeRole")}
        </p>
      </div>

      {/* Modern Tagline Callout */}
      <div className="w-full max-w-2xl bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl mt-6 relative overflow-hidden group select-none">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400" />
        <p className="text-xs md:text-sm text-slate-400 italic leading-relaxed">
          "{t("homeMaxim")}"
        </p>
        <div className="text-[10px] font-bold text-blue-400 mt-2 font-mono uppercase tracking-wider">
          — {t("homeMaximTitle")}
        </div>
      </div>

      {/* Specialization Modules - Gorgeous grid of hoverable interactive cards */}
      <div className="w-full mt-8">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 select-none">{t("homeVerticals")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          
          {/* Card 1: AI Agent pipelines */}
          <div className="bg-slate-900/25 border border-white/[0.04] rounded-2xl p-5 hover:bg-slate-900/40 hover:border-blue-500/25 hover:-translate-y-1 transition duration-300 group">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/10 w-fit group-hover:scale-110 transition-transform">
              <Bot size={18} />
            </div>
            <h4 className="text-sm font-extrabold text-white mt-4 group-hover:text-blue-400 transition-colors">{t("homeCard1Title")}</h4>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              {t("homeCard1Desc")}
            </p>
          </div>

          {/* Card 2: Web & Mobile */}
          <div className="bg-slate-900/25 border border-white/[0.04] rounded-2xl p-5 hover:bg-slate-900/40 hover:border-cyan-500/25 hover:-translate-y-1 transition duration-300 group">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/10 w-fit group-hover:scale-110 transition-transform">
              <Cpu size={18} />
            </div>
            <h4 className="text-sm font-extrabold text-white mt-4 group-hover:text-cyan-400 transition-colors">{t("homeCard2Title")}</h4>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              {t("homeCard2Desc")}
            </p>
          </div>

          {/* Card 3: Linux & Tools */}
          <div className="bg-slate-900/25 border border-white/[0.04] rounded-2xl p-5 hover:bg-slate-900/40 hover:border-purple-500/25 hover:-translate-y-1 transition duration-300 group">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/10 w-fit group-hover:scale-110 transition-transform">
              <Terminal size={18} />
            </div>
            <h4 className="text-sm font-extrabold text-white mt-4 group-hover:text-purple-400 transition-colors">{t("homeCard3Title")}</h4>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              {t("homeCard3Desc")}
            </p>
          </div>

        </div>
      </div>

      {/* Action Buttons with high-tech glowing styles */}
      <div className="mt-8 flex flex-wrap items-center gap-4 select-none">
        
        {/* CTA 1: View creations */}
        <Link
          to="/projects"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm py-3 px-5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/45 transition duration-300 group"
        >
          <Briefcase size={14} />
          <span>{t("homeCtaProjects")}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        
        {/* CTA 2: Chat with Agent */}
        <Link
          to="/assistant"
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/[0.08] hover:border-blue-500/35 font-semibold text-xs md:text-sm py-3 px-5 rounded-xl transition duration-300"
        >
          <Bot size={14} className="text-blue-400" />
          <span>{t("homeCtaTwin")}</span>
        </Link>

        {/* Separator Line */}
        <span className="w-[1px] h-[30px] bg-white/[0.08] hidden sm:block" />

        {/* CTA 3: Download CV */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            alert(language === "en" ? "Handshaking: CV download module loading..." : "Jabat Tangan: Mengunduh berkas CV...")
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition"
        >
          <Download size={14} />
          <span>{t("homeCtaCv")}</span>
        </a>
      </div>

    </div>
  )
}

export default Home
