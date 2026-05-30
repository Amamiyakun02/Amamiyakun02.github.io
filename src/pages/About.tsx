import { useState } from "react"
import { User, Award, Calendar, BookOpen, Star } from "lucide-react"
import { useApp } from "../context/AppContext"

type SkillCategory = "All" | "AI/ML" | "Web" | "Systems" | "Other"

type Skill = {
  name: string
  level: number // percentage
  desc: { en: string; id: string }
  category: "AI/ML" | "Web" | "Systems" | "Other"
}

const skillsData: Skill[] = [
  { 
    name: "Python", 
    level: 90, 
    desc: { 
      en: "Primary language for model orchestrations, scripting, and data pipelines.", 
      id: "Bahasa utama untuk orkestrasi model, pembuatan skrip, dan alur data." 
    }, 
    category: "AI/ML" 
  },
  { 
    name: "PyTorch & ML", 
    level: 75, 
    desc: { 
      en: "Model architecture exploration, fine-tuning, and vector mathematics.", 
      id: "Eksplorasi arsitektur model, penalaan halus (fine-tuning), dan matematika vektor." 
    }, 
    category: "AI/ML" 
  },
  { 
    name: "LangChain / RAG", 
    level: 85, 
    desc: { 
      en: "Building modular agent pipelines and custom knowledge retrieval indexes.", 
      id: "Membangun alur agen modular dan indeks pengambilan pengetahuan kustom." 
    }, 
    category: "AI/ML" 
  },
  { 
    name: "Gemini / OpenAI SDKs", 
    level: 90, 
    desc: { 
      en: "Full production integration of advanced multimodal intelligence models.", 
      id: "Integrasi produksi penuh dari model kecerdasan multimodal canggih." 
    }, 
    category: "AI/ML" 
  },
  
  { 
    name: "TypeScript / JS", 
    level: 85, 
    desc: { 
      en: "Writing safe, performant code for modern web architectures.", 
      id: "Menulis kode yang aman dan berkinerja tinggi untuk arsitektur web modern." 
    }, 
    category: "Web" 
  },
  { 
    name: "React & Next.js", 
    level: 80, 
    desc: { 
      en: "Crafting beautiful frontends and highly reactive dashboards.", 
      id: "Membuat frontend yang indah dan dasbor yang sangat reaktif." 
    }, 
    category: "Web" 
  },
  { 
    name: "Tailwind CSS", 
    level: 90, 
    desc: { 
      en: "Constructing pixel-perfect, highly responsive, premium styling systems.", 
      id: "Membangun sistem penataan gaya premium yang piksel-sempurna dan sangat responsif." 
    }, 
    category: "Web" 
  },
  { 
    name: "Node.js / Express", 
    level: 75, 
    desc: { 
      en: "Engineering efficient backend APIs and middleware servers.", 
      id: "Merekayasa API backend dan server middleware yang efisien." 
    }, 
    category: "Web" 
  },
  
  { 
    name: "Linux Administration", 
    level: 90, 
    desc: { 
      en: "System configuration, resource limits management, and server administration.", 
      id: "Konfigurasi sistem, manajemen batas sumber daya, dan administrasi server." 
    }, 
    category: "Systems" 
  },
  { 
    name: "Bash & Python Scripting", 
    level: 95, 
    desc: { 
      en: "Constructing advanced automation scripts to resolve routine struggles.", 
      id: "Membangun skrip otomatisasi tingkat lanjut untuk menyelesaikan rutinitas kerja." 
    }, 
    category: "Systems" 
  },
  { 
    name: "Docker Containers", 
    level: 80, 
    desc: { 
      en: "Packaging systems for sandboxed, highly reproducible deployments.", 
      id: "Mengemas sistem untuk penerapan yang aman (sandboxed) dan mudah direproduksi." 
    }, 
    category: "Systems" 
  },
  
  { 
    name: "Flutter & Dart", 
    level: 80, 
    desc: { 
      en: "Cross-platform mobile applications with high-fidelity canvas animations.", 
      id: "Aplikasi seluler lintas platform dengan animasi kanvas fidelitas tinggi." 
    }, 
    category: "Other" 
  },
  { 
    name: "SQL & MongoDB", 
    level: 75, 
    desc: { 
      en: "Structuring relational and document databases for persistent storage.", 
      id: "Menyusun basis data relasional dan dokumen untuk penyimpanan persisten." 
    }, 
    category: "Other" 
  }
]

const About = () => {
  const { t, language } = useApp()
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("All")

  const filteredSkills = activeCategory === "All"
    ? skillsData
    : skillsData.filter(s => s.category === activeCategory)

  const timelineData = [
    {
      year: t("aboutTimeline1Year"),
      title: t("aboutTimeline1Title"),
      subtitle: t("aboutTimeline1Subtitle"),
      description: t("aboutTimeline1Desc")
    },
    {
      year: t("aboutTimeline2Year"),
      title: t("aboutTimeline2Title"),
      subtitle: t("aboutTimeline2Subtitle"),
      description: t("aboutTimeline2Desc")
    },
    {
      year: t("aboutTimeline3Year"),
      title: t("aboutTimeline3Title"),
      subtitle: t("aboutTimeline3Subtitle"),
      description: t("aboutTimeline3Desc")
    }
  ]

  return (
    <div className="w-full min-h-fit lg:h-full flex flex-col justify-start items-stretch p-5 md:p-10 text-slate-100">
      
      {/* Header */}
      <div className="mb-8 animate-fade-in flex-shrink-0">
        <div className="flex items-center gap-3 text-blue-400 font-semibold uppercase tracking-wider text-xs md:text-sm">
          <User size={16} />
          <span>{t("aboutBanner")}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
          {t("aboutTitle")}
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-2">
          {t("aboutDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start w-full">
        {/* Left Column: Skills Grid (3/5 width) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Star size={16} className="text-blue-400 animate-pulse" />
              <span>{t("aboutMatrixTitle")}</span>
            </h3>
            
            {/* Category Filter */}
            <div className="flex gap-1 bg-slate-950/30 p-1 rounded-lg border border-white/[0.04]">
              {(["All", "AI/ML", "Web", "Systems"] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:max-h-[420px] lg:overflow-y-auto pr-1 scrollbar-thin">
            {filteredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-slate-900/30 border border-white/[0.04] rounded-2xl p-4 hover:border-blue-500/20 hover:bg-slate-900/40 transition duration-300 group"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-blue-400">{skill.level}%</span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden border border-white/[0.04] mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {skill.desc[language]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Timeline (2/5 width) */}
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award size={16} className="text-blue-400" />
            <span>{t("aboutChronTitle")}</span>
          </h3>

          <div className="relative border-l border-white/[0.08] ml-4 pl-6 space-y-6 py-2">
            {timelineData.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Bullet node */}
                <div className="absolute -left-[31px] top-1.5 bg-slate-950 border border-white/[0.1] rounded-full p-1.5 text-blue-400 group-hover:text-white group-hover:border-blue-500 transition duration-300">
                  <Calendar size={10} />
                </div>

                <span className="text-[10px] font-bold font-mono text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10">
                  {item.year}
                </span>

                <h4 className="text-sm font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                
                <h5 className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                  <BookOpen size={10} className="text-slate-500" />
                  <span>{item.subtitle}</span>
                </h5>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
