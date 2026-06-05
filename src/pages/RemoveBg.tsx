import { useState, useRef } from "react"
import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  Image as ImageIcon,
  X,
  ChevronLeft,
  RefreshCw,
  Download,
  AlertTriangle,
  Sparkles
} from "lucide-react"

const LOCAL_TRANSLATIONS = {
  title: {
    en: "AI Background Remover",
    id: "Penghapus Background AI"
  },
  subtitle: {
    en: "Automatically detect and erase image backgrounds in real-time.",
    id: "Deteksi dan hapus background gambar secara otomatis dan real-time."
  },
  uploadTitle: {
    en: "Drag and drop your image here",
    id: "Seret dan lepas gambar Anda di sini"
  },
  uploadSubtitle: {
    en: "or click to browse PNG, JPG, or JPEG",
    id: "atau klik untuk mencari PNG, JPG, atau JPEG"
  },
  uploadError: {
    en: "Invalid file type. Only PNG, JPG, and JPEG images are supported.",
    id: "Tipe file tidak valid. Hanya file PNG, JPG, dan JPEG yang didukung."
  },
  removeBtn: {
    en: "Remove Background",
    id: "Hapus Background"
  },
  removingBtn: {
    en: "Processing Image...",
    id: "Memproses Gambar..."
  },
  originalTitle: {
    en: "Original",
    id: "Asli"
  },
  resultTitle: {
    en: "Result (PNG)",
    id: "Hasil (PNG)"
  },
  downloadBtn: {
    en: "Download Result",
    id: "Unduh Hasil"
  },
  resetBtn: {
    en: "Upload Another Image",
    id: "Unggah Gambar Lain"
  },
  backToProjects: {
    en: "Back to Projects",
    id: "Kembali ke Proyek"
  },
  noPreview: {
    en: "Please upload an image and press 'Remove Background' to see the magic.",
    id: "Unggah gambar dan tekan 'Hapus Background' untuk melihat keajaibannya."
  },
  bgColorLabel: {
    en: "Background Color",
    id: "Warna Background"
  },
  transparent: {
    en: "Transparent",
    id: "Transparan"
  },
  white: {
    en: "White",
    id: "Putih"
  },
  black: {
    en: "Black",
    id: "Hitam"
  },
  red: {
    en: "Red",
    id: "Merah"
  },
  blue: {
    en: "Blue",
    id: "Biru"
  },
  green: {
    en: "Green",
    id: "Hijau"
  },
  yellow: {
    en: "Yellow",
    id: "Kuning"
  },
  custom: {
    en: "Custom Color",
    id: "Warna Kustom"
  }
}

const RemoveBg = () => {
  const { language } = useApp()
  const navigate = useNavigate()

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [resultImgUrl, setResultImgUrl] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState<string>("transparent")
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<boolean>(false)

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

  const handleFile = (selectedFile: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]
    if (validTypes.includes(selectedFile.type) || /\.(png|jpe?g)$/i.test(selectedFile.name)) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setResultImgUrl(null)
      setError(null)
    } else {
      setError(tl("uploadError"))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    setError(null)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const triggerUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setResultImgUrl(null)
    setError(null)
  }

  const handleRemoveBg = async () => {
    if (!file) return

    setProcessing(true)
    setError(null)
    setResultImgUrl(null)

    try {
      const endpoint = "https://amamiya-kun-removebg.hf.space/upload"
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error(
          language === "en"
            ? "Background removal request failed."
            : "Gagal memproses penghapusan background."
        )
      }

      const responseHtml = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(responseHtml, "text/html")
      const imgElement = doc.querySelector("img[src^='/hasil/']") || doc.querySelector("img.img-fluid")
      const src = imgElement ? imgElement.getAttribute("src") : null

      if (!src || !src.startsWith("/hasil/")) {
        throw new Error(
          language === "en"
            ? "Could not retrieve the processed image from the response."
            : "Gagal mendapatkan hasil gambar terproses dari server."
        )
      }

      setResultImgUrl(`https://amamiya-kun-removebg.hf.space${src}`)
    } catch (err: any) {
      console.error(err)
      setError(
        err.message ||
          (language === "en"
            ? "Failed to communicate with the background removal service."
            : "Gagal terhubung dengan layanan penghapus background.")
      )
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!resultImgUrl || !file) return
    try {
      if (bgColor === "transparent") {
        const response = await fetch(resultImgUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name
        a.download = `${originalName}_no_bg.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        return
      }

      // Fill canvas background with color
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = resultImgUrl
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name
              a.download = `${originalName}_color_bg.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
            }
          }, "image/png")
        }
      }
      img.onerror = () => {
        throw new Error("Failed to load image for rendering background color.")
      }
    } catch (err) {
      console.error(err)
      window.open(resultImgUrl, "_blank")
    }
  }

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
                  accept="image/png, image/jpeg, image/jpg"
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
                  PNG, JPG, JPEG Only
                </div>
              </div>
            ) : (
              /* File Selected Panel */
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-950/30 border border-white/[0.04] rounded-xl relative group">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10">
                    <ImageIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate pr-6" title={file.name}>
                      {file.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {!processing && (
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-full transition-all"
                      title={language === "en" ? "Remove file" : "Hapus file"}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Preview Selected Image */}
                {previewUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-white/[0.05] bg-slate-950/40 aspect-video flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  onClick={handleRemoveBg}
                  disabled={processing}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-2 border cursor-pointer ${
                    processing
                      ? "bg-slate-800 border-white/5 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 border-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/10 text-white"
                  }`}
                >
                  {processing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{tl("removingBtn")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>{tl("removeBtn")}</span>
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
          
          {processing && (
            <div className="bg-slate-900/30 border border-white/[0.04] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-ping" />
                <div className="p-5 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/15 relative">
                  <RefreshCw size={32} className="animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Removing Background</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Processing the image using Bi-RefNet model. Please hold on as the Hugging Face Space completes the extraction.
                </p>
              </div>
            </div>
          )}

          {!processing && !resultImgUrl && !error && (
            <div className="bg-slate-900/10 border border-white/[0.03] border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
              <ImageIcon size={40} className="stroke-[1.2]" />
              <p className="text-xs max-w-xs mx-auto leading-normal">
                {tl("noPreview")}
              </p>
            </div>
          )}

          {!processing && resultImgUrl && (
            <div className="flex flex-col gap-6 animate-fade-in w-full">
              
              {/* Comparison Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* Original View */}
                <div className="bg-slate-900/30 border border-white/[0.04] p-4 rounded-2xl flex flex-col items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {tl("originalTitle")}
                  </span>
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950/60 border border-white/[0.03] flex items-center justify-center">
                    {previewUrl && (
                      <img src={previewUrl} alt="Original input" className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                </div>

                {/* Result View */}
                <div className="bg-slate-900/30 border border-white/[0.04] p-4 rounded-2xl flex flex-col items-center gap-3 w-full">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1">
                    <Sparkles size={10} />
                    <span>{tl("resultTitle")}</span>
                  </span>
                  {/* Grid pattern background for transparency preview or custom background color */}
                  <div 
                    style={bgColor !== "transparent" ? { backgroundColor: bgColor } : {}}
                    className={`w-full aspect-square rounded-xl overflow-hidden border border-blue-500/15 flex items-center justify-center ${
                      bgColor === "transparent"
                        ? "bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] bg-slate-950"
                        : ""
                    }`}
                  >
                    <img src={resultImgUrl} alt="Output result" className="max-h-full max-w-full object-contain" />
                  </div>

                  {/* Background Color Toolbar */}
                  <div className="w-full mt-2 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {tl("bgColorLabel")}
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Transparent Option */}
                      <button
                        type="button"
                        onClick={() => setBgColor("transparent")}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center relative overflow-hidden transition duration-150 active:scale-90 ${
                          bgColor === "transparent" ? "border-blue-500 ring-2 ring-blue-500/30" : "border-white/10"
                        }`}
                        title={tl("transparent")}
                      >
                        <span className="absolute inset-0 bg-[linear-gradient(45deg,#cccccc_25%,transparent_25%),linear-gradient(-45deg,#cccccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cccccc_75%),linear-gradient(-45deg,transparent_75%,#cccccc_75%)] bg-[size:6px_6px] bg-slate-200" />
                        <span className="w-full h-0.5 bg-red-500 transform rotate-45 absolute z-10" />
                      </button>

                      {/* Solid Colors */}
                      {[
                        { name: "white", hex: "#ffffff" },
                        { name: "black", hex: "#000000" },
                        { name: "red", hex: "#ef4444" },
                        { name: "blue", hex: "#3b82f6" },
                        { name: "green", hex: "#22c55e" },
                        { name: "yellow", hex: "#eab308" }
                      ].map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setBgColor(color.hex)}
                          style={{ backgroundColor: color.hex }}
                          className={`w-7 h-7 rounded-full border transition duration-150 active:scale-90 ${
                            bgColor === color.hex ? "border-blue-500 ring-2 ring-blue-500/30" : "border-white/10"
                          }`}
                          title={tl(color.name as any)}
                        />
                      ))}

                      {/* Custom Color Picker */}
                      <div className="relative w-7 h-7">
                        <input
                          type="color"
                          value={bgColor === "transparent" ? "#ffffff" : bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          title={tl("custom")}
                        />
                        <div
                          style={{
                            background: bgColor === "transparent" || ["#ffffff", "#000000", "#ef4444", "#3b82f6", "#22c55e", "#eab308"].includes(bgColor)
                              ? "conic-gradient(red, yellow, green, cyan, blue, magenta, red)"
                              : bgColor
                          }}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition duration-150 active:scale-90 ${
                            bgColor !== "transparent" && !["#ffffff", "#000000", "#ef4444", "#3b82f6", "#22c55e", "#eab308"].includes(bgColor)
                              ? "border-blue-500 ring-2 ring-blue-500/30"
                              : "border-white/10"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-2">
                <button
                  onClick={handleDownload}
                  className="py-3 px-8 bg-blue-600 hover:bg-blue-500 border border-blue-500/20 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>{tl("downloadBtn")}</span>
                </button>
                <button
                  onClick={handleRemoveFile}
                  className="py-3 px-6 bg-slate-900/40 hover:bg-slate-900 border border-white/[0.05] rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>{tl("resetBtn")}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default RemoveBg
