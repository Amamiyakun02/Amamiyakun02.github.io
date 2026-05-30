import { useState } from "react"
import { ExternalLink, Github, Bot, Layout, Smartphone, Terminal, Briefcase } from "lucide-react"
import { useApp } from "../context/AppContext"

type ProjectType = {
  id: number
  title: string
  description: { en: string; id: string }
  category: "AI/ML" | "Web" | "Mobile" | "CLI"
  tech: string[]
  githubUrl: string
  liveUrl?: string
  icon: React.ComponentType<any>
  featured: boolean
}

const projectsData: ProjectType[] = [
  {
    id: 1,
    title: "Personal AI Assistant",
    description: {
      en: "A highly intelligent, context-aware chatbot acting as my digital clone. Capable of discussing skills, providing CV details, and answering professional inquiries dynamically in real time.",
      id: "Obrolan cerdas berbasis konteks yang bertindak sebagai klon digital saya. Mampu mendiskusikan keahlian, memberikan detail CV, dan menjawab pertanyaan profesional secara dinamis."
    },
    category: "AI/ML",
    tech: ["React", "TypeScript", "Tailwind CSS", "Gemini API", "LocalDB"],
    githubUrl: "https://github.com/Amamiyakun02/PersonalAssistant",
    liveUrl: "https://amamiyakun02.github.io/PersonalAssistant",
    icon: Bot,
    featured: true
  },
  {
    id: 2,
    title: "Agent Dashboard",
    description: {
      en: "An advanced, enterprise-grade admin console for orchestrating AI agent pipelines. Features live terminal logs, mongo integration, vector database status, and knowledge graph mapping.",
      id: "Konsol admin tingkat perusahaan yang canggih untuk mengorkestrasi jalur agen AI. Fitur logs terminal langsung, integrasi MongoDB, status basis data vektor, dan pemetaan graf pengetahuan."
    },
    category: "Web",
    tech: ["Next.js", "React 19", "Tailwind CSS", "MongoDB", "Python Services"],
    githubUrl: "https://github.com/Amamiyakun02/AgentDashboard",
    icon: Layout,
    featured: true
  },
  {
    id: 3,
    title: "Porto Apps",
    description: {
      en: "A comprehensive, high-performance cross-platform Flutter application. Integrates a suite of dev utilities, localized databases, and custom widgets designed for mobile efficiency.",
      id: "Aplikasi seluler Flutter lintas platform yang lengkap dan berkinerja tinggi. Mengintegrasikan rangkaian utilitas pengembang, basis data lokal, dan widget kustom untuk efisiensi seluler."
    },
    category: "Mobile",
    tech: ["Flutter", "Dart", "SQLite", "Riverpod State", "Custom Canvas"],
    githubUrl: "https://github.com/Amamiyakun02/PortoWeb/tree/main/porto_apps",
    icon: Smartphone,
    featured: false
  },
  {
    id: 4,
    title: "Stargazer CLI Toolkit",
    description: {
      en: "A hyper-optimized set of custom bash and python command line tools built for automated system monitoring, remote server orchestration, and background worker scheduling on Linux.",
      id: "Kumpulan alat baris perintah bash dan python kustom yang sangat dioptimalkan untuk pemantauan sistem otomatis, orkestrasi server jarak jauh, dan penjadwalan pekerja latar belakang di Linux."
    },
    category: "CLI",
    tech: ["Bash", "Python", "Linux CLI", "POSIX Shell", "Cron Workers"],
    githubUrl: "https://github.com/Amamiyakun02/StargazerCLI",
    icon: Terminal,
    featured: false
  }
]

const Projects = () => {
  const { t, language } = useApp()
  const [activeTab, setActiveTab] = useState<"All" | "AI/ML" | "Web" | "Mobile" | "CLI">("All")

  const filteredProjects = activeTab === "All"
    ? projectsData
    : projectsData.filter(p => p.category === activeTab)

  const getTabLabel = (tab: typeof activeTab) => {
    if (tab === "All") {
      return language === "en" ? "All" : "Semua"
    }
    return tab
  }

  return (
    <div className="w-full min-h-fit lg:h-full flex flex-col justify-start items-start p-5 md:p-10 text-slate-100">
      
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 text-blue-400 font-semibold uppercase tracking-wider text-xs md:text-sm">
          <Briefcase size={16} />
          <span>{t("projectsBanner")}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
          {t("projectsTitle")}
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
          {t("projectsDesc")}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-950/40 p-1.5 rounded-xl border border-white/[0.05] w-full max-w-lg">
        {(["All", "AI/ML", "Web", "Mobile", "CLI"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[70px] text-xs md:text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full lg:overflow-y-auto lg:max-h-[480px] pr-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => {
            const IconComp = project.icon
            return (
              <div
                key={project.id}
                style={{ animationDelay: `${idx * 0.1}s` }}
                className="group relative flex flex-col bg-slate-900/30 border border-white/[0.04] rounded-2xl p-5 md:p-6 hover:border-blue-500/30 hover:bg-slate-900/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Accent glow on top left */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-300" />
                
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <IconComp size={22} />
                  </div>
                  
                  {/* Action Links */}
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-950/60 rounded-full text-slate-400 hover:text-white hover:bg-slate-950 border border-white/[0.05] transition-all"
                      title={language === "en" ? "View GitHub Repository" : "Lihat Repositori GitHub"}
                    >
                      <Github size={16} />
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-950/60 rounded-full text-slate-400 hover:text-white hover:bg-slate-950 border border-white/[0.05] transition-all"
                        title={language === "en" ? "View Live Demo" : "Lihat Demo Langsung"}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <span className="inline-block self-start text-[10px] uppercase font-bold text-blue-400 px-2 py-0.5 mt-1 bg-blue-500/10 rounded-md border border-blue-500/10">
                  {project.category}
                </span>

                <p className="text-xs md:text-sm text-slate-400 mt-3 leading-relaxed flex-1">
                  {project.description[language]}
                </p>

                {/* Tech Badges */}
                <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-slate-950/40 text-slate-400 px-2 py-1 rounded-md border border-white/[0.04]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            {language === "en" ? "No projects found in this category." : "Tidak ada proyek ditemukan dalam kategori ini."}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
