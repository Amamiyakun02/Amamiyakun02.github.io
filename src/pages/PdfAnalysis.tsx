import { useState, useRef } from "react"
import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  FileText,
  Sliders,
  AlertTriangle,
  X,
  ChevronLeft,
  RefreshCw,
  Clock,
  Layers,
  FileCheck,
  Search
} from "lucide-react"

type PDFMetadata = {
  title: string
  author: string
  subject: string
  keywords: string
  creator: string
  producer: string
  creationDate: string
  modDate: string
  format: string
  encryption: string
}

type PDFPageDetail = {
  page: number
  is_colored: boolean
}

type PDFColorAnalysisResponse = {
  status: string
  filename: string
  file_size_bytes: number
  file_size_formatted: string
  total_pages: number
  colored_pages_count: number
  grayscale_pages_count: number
  colored_pages: number[]
  grayscale_pages: number[]
  threshold_used: number
  detection_time_seconds: number
  metadata: PDFMetadata
  pages_details: PDFPageDetail[]
}

const LOCAL_TRANSLATIONS = {
  title: {
    en: "PDF Document Analyzer",
    id: "Penganalisis Dokumen PDF"
  },
  subtitle: {
    en: "Examine page color distributions and extract structural document metadata.",
    id: "Periksa distribusi warna halaman dan ekstrak metadata dokumen struktural."
  },
  uploadTitle: {
    en: "Drag and drop your PDF here",
    id: "Seret dan lepas PDF Anda di sini"
  },
  uploadSubtitle: {
    en: "or click to browse from your device",
    id: "atau klik untuk mencari dari perangkat Anda"
  },
  uploadError: {
    en: "Invalid file type. Only PDF files are supported.",
    id: "Tipe file tidak valid. Hanya file PDF yang didukung."
  },
  thresholdLabel: {
    en: "Color Detection Threshold",
    id: "Ambang Batas Deteksi Warna"
  },
  thresholdHelp: {
    en: "Adjusts RGB variance tolerance. Lower values are stricter (subtle color triggers detection), higher values are more lenient.",
    id: "Menyesuaikan toleransi variasi RGB. Nilai lebih rendah lebih ketat (warna tipis memicu deteksi), nilai lebih tinggi lebih toleran."
  },
  analyzeBtn: {
    en: "Analyze Document",
    id: "Analisis Dokumen"
  },
  analyzingBtn: {
    en: "Analyzing Pages...",
    id: "Menganalisis Halaman..."
  },
  metaTitle: {
    en: "Document Metadata",
    id: "Metadata Dokumen"
  },
  summaryTitle: {
    en: "Analysis Summary",
    id: "Ringkasan Analisis"
  },
  total: {
    en: "Total Pages",
    id: "Total Halaman"
  },
  colored: {
    en: "Colored Pages",
    id: "Halaman Berwarna"
  },
  grayscale: {
    en: "Grayscale Pages",
    id: "Halaman Grayscale"
  },
  duration: {
    en: "Execution Time",
    id: "Waktu Eksekusi"
  },
  ratioTitle: {
    en: "Color Distribution Ratio",
    id: "Rasio Distribusi Warna"
  },
  pagesTitle: {
    en: "Page Breakdown",
    id: "Rincian Halaman"
  },
  filterAll: {
    en: "All Pages",
    id: "Semua Halaman"
  },
  filterColored: {
    en: "Color Only",
    id: "Hanya Berwarna"
  },
  filterGrayscale: {
    en: "Grayscale Only",
    id: "Hanya Grayscale"
  },
  searchPlaceholder: {
    en: "Search page number...",
    id: "Cari nomor halaman..."
  },
  backToProjects: {
    en: "Back to Projects",
    id: "Kembali ke Proyek"
  },
  noPages: {
    en: "No pages match the active filters.",
    id: "Tidak ada halaman yang cocok dengan filter aktif."
  },
  resetBtn: {
    en: "Upload Another File",
    id: "Unggah File Lain"
  }
}

const PdfAnalysis = () => {
  const { language } = useApp()
  const navigate = useNavigate()

  const [file, setFile] = useState<File | null>(null)
  const [threshold, setThreshold] = useState<number>(15)
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [result, setResult] = useState<PDFColorAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<boolean>(false)
  
  // Filtering page grid
  const [activeFilter, setActiveFilter] = useState<"all" | "color" | "grayscale">("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const tl = (key: keyof typeof LOCAL_TRANSLATIONS) => {
    return LOCAL_TRANSLATIONS[key][language] || LOCAL_TRANSLATIONS[key]["en"]
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf" || droppedFile.name.toLowerCase().endsWith(".pdf")) {
        setFile(droppedFile)
      } else {
        setError(tl("uploadError"))
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setFile(selectedFile)
      } else {
        setError(tl("uploadError"))
      }
    }
  }

  const triggerUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      const baseUrl = isLocalhost ? "http://127.0.0.1:8000" : "https://myagentic-apps.fastapicloud.dev"
      const endpoint = `${baseUrl}/v1/pdf/check-color?threshold=${threshold}`

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || (language === "en" ? "Analysis request failed." : "Analisis gagal dilakukan."))
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || (language === "en" ? "Failed to communicate with the PDF analysis service." : "Gagal terhubung dengan layanan analisis PDF."))
    } finally {
      setAnalyzing(false)
    }
  }

  // Filtered pages for details grid
  const filteredPages = result
    ? result.pages_details.filter(p => {
        const matchesFilter =
          activeFilter === "all" ||
          (activeFilter === "color" && p.is_colored) ||
          (activeFilter === "grayscale" && !p.is_colored)
        const matchesSearch = searchQuery === "" || p.page.toString().includes(searchQuery)
        return matchesFilter && matchesSearch
      })
    : []

  return (
    <div className="w-full min-h-fit lg:h-full flex flex-col justify-start items-start p-5 md:p-10 text-slate-100 overflow-y-auto no-scrollbar pb-32">
      
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in shrink-0">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:text-blue-300 transition-colors mb-2 uppercase tracking-wider"
          >
            <ChevronLeft size={14} />
            <span>{tl("backToProjects")}</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
            {tl("title")}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            {tl("subtitle")}
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls / File Uploader */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          
          <div className="bg-slate-900/30 border border-white/[0.04] rounded-2xl p-5 md:p-6 hover:border-blue-500/10 transition-all duration-300 relative overflow-hidden">
            {/* Ambient background accent */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            {!file ? (
              /* Drag Drop Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerUploadClick}
                className={`group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : "border-white/10 hover:border-blue-500/30 hover:bg-slate-950/20"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf"
                  className="hidden"
                />
                <div className="p-4 bg-blue-500/5 rounded-2xl text-blue-400 group-hover:scale-110 border border-blue-500/10 transition-transform duration-300 mb-4 shadow-sm">
                  <Upload size={32} />
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {tl("uploadTitle")}
                </h3>
                <p className="text-xs text-slate-400">
                  {tl("uploadSubtitle")}
                </p>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-4 px-2 py-0.5 bg-slate-950/40 rounded border border-white/[0.03]">
                  PDF File Only
                </div>
              </div>
            ) : (
              /* File Selected Panel */
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-950/30 border border-white/[0.04] rounded-xl relative group">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate pr-6" title={file.name}>
                      {file.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  {!analyzing && (
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-full transition-all"
                      title={language === "en" ? "Remove file" : "Hapus file"}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Threshold Slider */}
                <div className="space-y-3 bg-slate-950/20 border border-white/[0.03] p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sliders size={14} className="text-blue-400" />
                      <span>{tl("thresholdLabel")}</span>
                    </label>
                    <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-md">
                      {threshold}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    disabled={analyzing}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {tl("thresholdHelp")}
                  </p>
                  {threshold < 5 && (
                    <div className="flex items-center gap-1.5 text-[9px] text-amber-400 bg-amber-500/5 border border-amber-500/10 p-2 rounded-md">
                      <AlertTriangle size={12} className="shrink-0" />
                      <span>Very strict threshold might categorize compression artifacts as color.</span>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-2 border cursor-pointer ${
                    analyzing
                      ? "bg-slate-800 border-white/5 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 border-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/10 text-white"
                  }`}
                >
                  {analyzing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{tl("analyzingBtn")}</span>
                    </>
                  ) : (
                    <>
                      <FileCheck size={14} />
                      <span>{tl("analyzeBtn")}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={16} />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-0.5">
                  Error Encountered
                </h4>
                <p className="text-xs text-rose-400 leading-normal">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results view */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          
          {analyzing && (
            <div className="bg-slate-900/30 border border-white/[0.04] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-ping" />
                <div className="p-5 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/15 relative">
                  <RefreshCw size={32} className="animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Analyzing PDF Color Composition</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Parsing page pixmaps at low DPI to detect RGB differences. Please hold on as we query the agent service.
                </p>
              </div>
            </div>
          )}

          {!analyzing && !result && !error && (
            <div className="bg-slate-900/10 border border-white/[0.03] border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
              <FileText size={40} className="stroke-[1.2]" />
              <p className="text-xs max-w-xs mx-auto leading-normal">
                {language === "en"
                  ? "Select a document and hit Analyze to query the vector engine and retrieve details."
                  : "Pilih dokumen dan tekan Analisis untuk memanggil mesin vektor dan melihat detail."}
              </p>
            </div>
          )}

          {!analyzing && result && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Summary Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/30 border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {tl("total")}
                  </span>
                  <span className="text-2xl font-black text-white mt-1">
                    {result.total_pages}
                  </span>
                </div>
                <div className="bg-slate-900/30 border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    {tl("colored")}
                  </span>
                  <span className="text-2xl font-black text-blue-400 mt-1">
                    {result.colored_pages_count}
                  </span>
                </div>
                <div className="bg-slate-900/30 border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    {tl("grayscale")}
                  </span>
                  <span className="text-2xl font-black text-slate-300 mt-1">
                    {result.grayscale_pages_count}
                  </span>
                </div>
                <div className="bg-slate-900/30 border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                    <Clock size={10} />
                    <span>{tl("duration")}</span>
                  </span>
                  <span className="text-2xl font-black text-emerald-400 mt-1">
                    {result.detection_time_seconds}s
                  </span>
                </div>
              </div>

              {/* Color Distribution Bar */}
              <div className="bg-slate-900/30 border border-white/[0.04] p-5 rounded-2xl space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers size={13} className="text-blue-400" />
                  <span>{tl("ratioTitle")}</span>
                </h3>
                
                {/* Horizontal Percentage Bar */}
                <div className="relative w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-white/[0.04] flex">
                  {result.colored_pages_count > 0 && (
                    <div
                      style={{ width: `${(result.colored_pages_count / result.total_pages) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-[inset_-3px_0_8px_rgba(0,0,0,0.15)]"
                    />
                  )}
                  {result.grayscale_pages_count > 0 && (
                    <div
                      style={{ width: `${(result.grayscale_pages_count / result.total_pages) * 100}%` }}
                      className="h-full bg-slate-700"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>
                      {result.colored_pages_count} (
                      {Math.round((result.colored_pages_count / result.total_pages) * 100)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>
                      {result.grayscale_pages_count} (
                      {Math.round((result.grayscale_pages_count / result.total_pages) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Panel */}
              <div className="bg-slate-900/30 border border-white/[0.04] p-5 rounded-2xl">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4 pb-2 border-b border-white/[0.04]">
                  {tl("metaTitle")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { label: "Title / Judul", val: result.metadata.title || "-" },
                    { label: "Author / Penulis", val: result.metadata.author || "-" },
                    { label: "Creator / Pembuat", val: result.metadata.creator || "-" },
                    { label: "Producer / Produser", val: result.metadata.producer || "-" },
                    { label: "Encryption / Enkripsi", val: result.metadata.encryption || "None" },
                    { label: "Format", val: result.metadata.format || "-" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {item.label}
                      </span>
                      <span className="text-slate-200 mt-1 font-semibold break-words">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Grid of Pages */}
              <div className="bg-slate-900/30 border border-white/[0.04] p-5 rounded-2xl flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-white/[0.04]">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    {tl("pagesTitle")}
                  </h3>
                  
                  {/* Search Page Input */}
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ""))}
                      placeholder={tl("searchPlaceholder")}
                      className="w-full bg-slate-950/60 border border-white/5 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Grid filter tabs */}
                <div className="flex gap-1 bg-slate-950/40 p-1 rounded-lg border border-white/[0.03] self-start">
                  {(["all", "color", "grayscale"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveFilter(mode)}
                      className={`text-[10px] font-bold py-1 px-3.5 rounded-md transition-all cursor-pointer ${
                        activeFilter === mode
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {mode === "all" ? tl("filterAll") : mode === "color" ? tl("filterColored") : tl("filterGrayscale")}
                    </button>
                  ))}
                </div>

                {/* Page badges grid */}
                {filteredPages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredPages.map((pageObj) => (
                      <div
                        key={pageObj.page}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                          pageObj.is_colored
                            ? "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
                            : "bg-slate-950/20 border-white/[0.04] hover:border-white/10"
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 font-bold select-none uppercase tracking-wide leading-none">
                          Page
                        </span>
                        <span className="text-sm font-black text-white font-mono mt-1">
                          {pageObj.page}
                        </span>
                        <span
                          className={`text-[8px] font-extrabold uppercase mt-1 px-1 py-0.5 rounded leading-none ${
                            pageObj.is_colored
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {pageObj.is_colored ? "Color" : "Gray"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-xl">
                    {tl("noPages")}
                  </div>
                )}
              </div>

              {/* Upload Another Button */}
              <button
                onClick={handleRemoveFile}
                className="self-center py-2.5 px-6 bg-slate-900/40 hover:bg-slate-900 border border-white/[0.05] rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>{tl("resetBtn")}</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default PdfAnalysis
