import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  Image as ImageIcon,
  X,
  ChevronLeft,
  RefreshCw,
  AlertTriangle,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2
} from "lucide-react"

const LOCAL_TRANSLATIONS = {
  title: {
    en: "Image to PDF Converter",
    id: "Konverter Gambar ke PDF"
  },
  subtitle: {
    en: "Compile and merge multiple images into a single high-quality PDF document.",
    id: "Kumpulkan dan gabungkan beberapa gambar menjadi satu dokumen PDF berkualitas tinggi."
  },
  uploadTitle: {
    en: "Drag and drop your images here",
    id: "Seret dan lepas gambar Anda di sini"
  },
  uploadSubtitle: {
    en: "or click to browse JPG, JPEG, or PNG files",
    id: "atau klik untuk mencari file JPG, JPEG, atau PNG"
  },
  uploadError: {
    en: "Invalid file type. Only JPG, JPEG, and PNG images are supported.",
    id: "Tipe file tidak valid. Hanya file JPG, JPEG, dan PNG yang didukung."
  },
  convertBtn: {
    en: "Convert to PDF",
    id: "Konversi ke PDF"
  },
  convertingBtn: {
    en: "Converting...",
    id: "Mengonversi..."
  },
  noImages: {
    en: "No images uploaded yet. Upload images to start building your PDF.",
    id: "Belum ada gambar yang diunggah. Unggah gambar untuk mulai menyusun PDF Anda."
  },
  clearAll: {
    en: "Clear All",
    id: "Hapus Semua"
  },
  backToProjects: {
    en: "Back to Projects",
    id: "Kembali ke Proyek"
  },
  pageNumber: {
    en: "Page",
    id: "Halaman"
  }
}

type UploadedImage = {
  id: string
  file: File
  previewUrl: string
}

const ImageToPdf = () => {
  const { language } = useApp()
  const navigate = useNavigate()

  const [images, setImages] = useState<UploadedImage[]>([])
  const [processing, setProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const tl = (key: keyof typeof LOCAL_TRANSLATIONS) => {
    return LOCAL_TRANSLATIONS[key][language] || LOCAL_TRANSLATIONS[key]["en"]
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    }
  }, [])

  const handleFiles = (selectedFiles: FileList) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]
    const newUploaded: UploadedImage[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      if (validTypes.includes(file.type) || /\.(png|jpe?g)$/i.test(file.name)) {
        newUploaded.push({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          previewUrl: URL.createObjectURL(file)
        })
      } else {
        setError(tl("uploadError"))
      }
    }

    if (newUploaded.length > 0) {
      setImages((prev) => [...prev, ...newUploaded])
      setError(null)
    }
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
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const triggerUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (id: string) => {
    const target = images.find((img) => img.id === id)
    if (target) {
      URL.revokeObjectURL(target.previewUrl)
    }
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleClearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    setImages([])
    setError(null)
  }

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      const temp = newImages[index]
      newImages[index] = newImages[targetIndex]
      newImages[targetIndex] = temp
      setImages(newImages)
    }
  }

  const handleConvert = async () => {
    if (images.length === 0) return

    setProcessing(true)
    setError(null)

    try {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      const baseUrl = isLocalhost ? "http://127.0.0.1:8000" : "https://myagentic-apps.fastapicloud.dev"
      const endpoint = `${baseUrl}/v1/pdf/image-to-pdf`

      const formData = new FormData()
      images.forEach((img) => {
        formData.append("files", img.file)
      })

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(
          errData.detail ||
            (language === "en" ? "Failed to convert images to PDF." : "Gagal mengonversi gambar ke PDF.")
        )
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `images_converted_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err: any) {
      console.error(err)
      setError(
        err.message ||
          (language === "en"
            ? "Communication failure with the PDF conversion service."
            : "Gagal terhubung dengan layanan konversi PDF.")
      )
    } finally {
      setProcessing(false)
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
        
        {/* Left Column: Upload Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          
          <div className="bg-slate-900/30 border border-white/[0.04] rounded-2xl p-5 md:p-6 hover:border-blue-500/10 transition-all duration-300 relative overflow-hidden">
            {/* Ambient background accent */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Drag Drop Zone */}
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
                multiple
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
                JPG, JPEG, PNG Supported
              </div>
            </div>

            {/* Action Buttons if images uploaded */}
            {images.length > 0 && (
              <div className="flex flex-col gap-3 mt-5">
                <button
                  onClick={handleConvert}
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
                      <span>{tl("convertingBtn")}</span>
                    </>
                  ) : (
                    <>
                      <FileText size={14} />
                      <span>{tl("convertBtn")}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClearAll}
                  disabled={processing}
                  className="w-full py-2.5 rounded-xl border border-white/[0.05] bg-slate-950/20 hover:bg-slate-950/40 hover:text-rose-400 text-xs font-bold text-slate-400 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>{tl("clearAll")}</span>
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

        {/* Right Column: Files List preview */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          
          {images.length === 0 ? (
            <div className="bg-slate-900/10 border border-white/[0.03] border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
              <ImageIcon size={40} className="stroke-[1.2]" />
              <p className="text-xs max-w-xs mx-auto leading-normal">
                {tl("noImages")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin animate-fade-in">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="bg-slate-900/30 border border-white/[0.04] p-3.5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition group"
                >
                  {/* Page Indicator */}
                  <div className="flex flex-col items-center justify-center bg-slate-950/60 border border-white/[0.04] rounded-xl w-12 h-12 shrink-0">
                    <span className="text-[8px] uppercase text-slate-500 font-bold tracking-wider leading-none">
                      {tl("pageNumber")}
                    </span>
                    <span className="text-base font-black text-blue-400 leading-none mt-1">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Image Thumbnail */}
                  <div className="w-16 h-12 bg-slate-950/40 rounded-lg overflow-hidden border border-white/[0.03] flex items-center justify-center shrink-0">
                    <img src={img.previewUrl} alt="Thumbnail" className="max-w-full max-h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate" title={img.file.name}>
                      {img.file.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {(img.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Sorting & Deletion Controls */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveImage(idx, "up")}
                      disabled={idx === 0 || processing}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                      title={language === "en" ? "Move Up" : "Pindahkan ke atas"}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveImage(idx, "down")}
                      disabled={idx === images.length - 1 || processing}
                      className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                      title={language === "en" ? "Move Down" : "Pindahkan ke bawah"}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      disabled={processing}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition"
                      title={language === "en" ? "Remove Image" : "Hapus Gambar"}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default ImageToPdf
