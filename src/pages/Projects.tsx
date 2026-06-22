import { useState, useRef, useEffect } from "react"
import { ExternalLink, Github, Briefcase, FileText, Bot, ShoppingBag, Image, FileImage, LayoutDashboard, Smartphone } from "lucide-react"
import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"

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
    title: "PDF Analysis Tool",
    description: {
      en: "A full-stack AI document analysis platform built with React and FastAPI. Upload any PDF to extract page count, file size, font families, and embedded image metadata. Powered by PyMuPDF for deep structural parsing, with per-page color distribution heatmaps and an AI-generated document summary via integrated LLM.",
      id: "Platform analisis dokumen AI full-stack yang dibangun dengan React dan FastAPI. Unggah PDF apa pun untuk mengekstrak jumlah halaman, ukuran file, jenis font, dan metadata gambar tertanam. Didukung PyMuPDF untuk parsing struktural mendalam, dengan heatmap distribusi warna per halaman dan ringkasan dokumen yang dibuat oleh LLM terintegrasi."
    },
    category: "AI/ML",
    tech: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "PyMuPDF"],
    githubUrl: "https://github.com/Amamiyakun02/myAgentic-apps",
    liveUrl: "/pdf-analysis",
    icon: FileText,
    featured: true
  },
  {
    id: 2,
    title: "Agent MCP",
    description: {
      en: "A production-ready Model Context Protocol (MCP) server built with Python and the MCP SDK. Exposes 10 callable tools to AI agents — including math operations, system info, text manipulation, and real-time clock — plus resources and prompt templates. Designed to integrate seamlessly with Claude Desktop and other MCP-compatible LLM clients via stdio.",
      id: "Server Model Context Protocol (MCP) siap produksi yang dibangun dengan Python dan MCP SDK. Mengekspos 10 tool yang dapat dipanggil oleh agen AI — termasuk operasi matematika, info sistem, manipulasi teks, dan jam real-time — serta resources dan template prompt. Dirancang untuk terintegrasi mulus dengan Claude Desktop dan klien LLM kompatibel MCP lainnya via stdio."
    },
    category: "AI/ML",
    tech: ["Python", "MCP SDK", "uv", "AI Integration", "Claude Desktop"],
    githubUrl: "https://github.com/Amamiyakun02/AgentMCP",
    icon: Bot,
    featured: true
  },
  {
    id: 3,
    title: "Lina Deals",
    description: {
      en: "A modern e-commerce deals aggregator and AI shopping assistant platform built with React 19 and FastAPI. Browse and filter curated discount offers across multiple channels, powered by a conversational AI chatbot backed by a vector database (Qdrant) and a scraping pipeline. Deployed on Vercel with a custom MCP server for live product search.",
      id: "Platform agregator penawaran e-commerce modern dan asisten belanja AI yang dibangun dengan React 19 dan FastAPI. Temukan dan filter penawaran diskon pilihan dari berbagai saluran, didukung chatbot AI percakapan dengan vector database (Qdrant) dan pipeline scraping. Di-deploy di Vercel dengan MCP server khusus untuk pencarian produk langsung."
    },
    category: "Web",
    tech: ["React 19", "Tailwind CSS", "FastAPI", "Qdrant", "Vercel"],
    githubUrl: "https://github.com/Amamiyakun02/lina-deals",
    liveUrl: "https://lina-deals.vercel.app",
    icon: ShoppingBag,
    featured: true
  },
  {
    id: 4,
    title: "AI Background Remover",
    description: {
      en: "An in-browser AI background removal tool powered by Hugging Face's Bi-RefNet model — a state-of-the-art bilateral reference network for high-precision subject segmentation. Supports PNG and JPG uploads with real-time processing, before/after preview, and one-click download of the transparent output, all without sending data to a custom backend.",
      id: "Alat penghapus background AI berbasis browser yang didukung model Bi-RefNet dari Hugging Face — jaringan referensi bilateral mutakhir untuk segmentasi subjek presisi tinggi. Mendukung unggahan PNG dan JPG dengan pemrosesan real-time, pratinjau sebelum/sesudah, dan unduhan satu klik hasil transparan, semua tanpa mengirim data ke backend khusus."
    },
    category: "AI/ML",
    tech: ["React", "TypeScript", "Tailwind CSS", "Hugging Face Spaces", "Bi-RefNet"],
    githubUrl: "https://github.com/Amamiyakun02/myAgentic-apps",
    liveUrl: "/remove-bg",
    icon: Image,
    featured: true
  },
  {
    id: 5,
    title: "Image to PDF Converter",
    description: {
      en: "A drag-and-drop web utility for compiling multiple images into a single, print-ready PDF document. Supports PNG and JPG files with reorderable previews before conversion. The FastAPI backend uses PyMuPDF to produce high-fidelity PDFs, preserving original image dimensions and quality — ideal for scanning, archiving, and document workflows.",
      id: "Utilitas web drag-and-drop untuk menyatukan beberapa gambar menjadi satu dokumen PDF siap cetak. Mendukung file PNG dan JPG dengan pratinjau yang dapat diurutkan ulang sebelum konversi. Backend FastAPI menggunakan PyMuPDF untuk menghasilkan PDF berkualitas tinggi, mempertahankan dimensi dan kualitas gambar asli — ideal untuk scanning, pengarsipan, dan alur kerja dokumen."
    },
    category: "Web",
    tech: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "PyMuPDF"],
    githubUrl: "https://github.com/Amamiyakun02/myAgentic-apps",
    liveUrl: "/image-to-pdf",
    icon: FileImage,
    featured: true
  },
  {
    id: 6,
    title: "Agent Dashboard",
    description: {
      en: "A full-featured internal admin dashboard for managing AI agent data and knowledge bases. Features role-based access control (Superadmin & Sales), full CRUD operations for products, brands, categories, users, bookings, and chat sessions. Includes a Knowledge Management module for uploading and indexing documents into a vector store, powering a retrieval-augmented AI assistant.",
      id: "Dashboard admin internal berfitur lengkap untuk mengelola data agen AI dan knowledge base. Dilengkapi kontrol akses berbasis peran (Superadmin & Sales), operasi CRUD lengkap untuk produk, merek, kategori, pengguna, pemesanan, dan sesi chat. Termasuk modul Knowledge Management untuk mengunggah dan mengindeks dokumen ke vector store, yang mendukung asisten AI berbasis retrieval."
    },
    category: "Web",
    tech: ["React", "TypeScript", "Vite", "ShadCN UI", "FastAPI", "Qdrant"],
    githubUrl: "https://github.com/Amamiyakun02/AgentDashboard",
    icon: LayoutDashboard,
    featured: true
  },
  {
    id: 7,
    title: "Vienna Assistant Mobile",
    description: {
      en: "A native Android mobile application for Vienna AI Assistant. Designed with modern fluid UI, it integrates directly with the main AI backend to provide conversational RAG capabilities, and seamless access to personal knowledge bases directly from your smartphone.",
      id: "Aplikasi seluler Android native untuk Asisten AI Vienna. Dirancang dengan UI modern dan responsif, berintegrasi langsung dengan backend AI utama untuk menyediakan fitur chat cerdas berbasis RAG, serta akses cepat ke knowledge base pribadi langsung dari genggaman Anda."
    },
    category: "Mobile",
    tech: ["Kotlin", "Jetpack Compose", "Android SDK", "Coroutines", "Retrofit"],
    githubUrl: "https://github.com/Amamiyakun02/AssistantMobile",
    icon: Smartphone,
    featured: true
  }
]

const Projects = () => {
  const { t, language } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"All" | "AI/ML" | "Web" | "Mobile" | "CLI">("All")
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = 0
    }
  }, [activeTab])

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
    <div className="w-full flex-1 min-h-0 flex flex-col justify-start items-stretch p-5 md:p-10 text-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="mb-6 animate-fade-in flex-shrink-0">
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
      <div className="flex flex-wrap gap-2 mb-6 bg-slate-950/40 p-1.5 rounded-xl border border-white/[0.05] w-full max-w-lg flex-shrink-0">
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
      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full flex-1 overflow-y-auto pr-2 min-h-0 pb-24 lg:pb-8 scrollbar-thin content-start"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => {
            const IconComp = project.icon
            return (
              <div
                key={project.id}
                style={{ animationDelay: `${idx * 0.08}s` }}
                onClick={() => {
                  if (project.liveUrl && project.liveUrl.startsWith("/")) {
                    navigate(project.liveUrl)
                  }
                }}
                className={`group relative flex flex-col bg-gradient-to-br from-slate-900/60 to-slate-950/45 border border-white/[0.05] rounded-[24px] p-5 md:p-6 hover:border-blue-500/30 hover:bg-slate-900/50 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)] transition-all duration-300 transform hover:-translate-y-1 ${
                  project.liveUrl && project.liveUrl.startsWith("/") ? "cursor-pointer" : ""
                }`}
              >
                {/* Accent glow on top left */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />
                
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/15 group-hover:scale-110 group-hover:bg-blue-600/15 transition-all duration-300">
                    <IconComp size={22} />
                  </div>
                  
                  {/* Action Links */}
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 bg-slate-950/40 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-white/[0.04] hover:border-blue-500/30 transition-all duration-300"
                      title={language === "en" ? "View GitHub Repository" : "Lihat Repositori GitHub"}
                    >
                      <Github size={16} />
                    </a>
                    {project.liveUrl && (
                      project.liveUrl.startsWith("/") ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(project.liveUrl!)
                          }}
                          className="p-2.5 bg-slate-950/40 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-white/[0.04] hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                          title={language === "en" ? "View Live Demo" : "Lihat Demo Langsung"}
                        >
                          <ExternalLink size={16} />
                        </button>
                      ) : (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 bg-slate-950/40 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-white/[0.04] hover:border-blue-500/30 transition-all duration-300"
                          title={language === "en" ? "View Live Demo" : "Lihat Demo Langsung"}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <h3 className="text-lg md:text-xl font-black text-white group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <span className="inline-block self-start text-[9px] tracking-wider uppercase font-bold text-blue-400 px-2.5 py-0.5 mt-2 bg-blue-500/10 rounded-full border border-blue-500/15">
                  {project.category}
                </span>

                <p className="text-xs md:text-sm text-slate-300/90 mt-4 leading-relaxed flex-grow">
                  {project.description[language]}
                </p>

                {/* Tech Badges */}
                <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.05]">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-white/[0.02] text-slate-300 px-2.5 py-1 rounded-lg border border-white/[0.04] transition-all hover:bg-white/[0.05] hover:text-white"
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
