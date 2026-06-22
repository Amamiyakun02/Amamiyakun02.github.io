import { useState } from "react"
import { useApp } from "../context/AppContext"
import { Send, MessageSquare, Star, User, Layers, CheckCircle } from "lucide-react"

const Feedback = () => {
  const { theme, language } = useApp()
  const [formData, setFormData] = useState({
    customer_name: "",
    rating: "5",
    category: "general",
    content: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? "http://127.0.0.1:8000" : "https://myagentic-apps.fastapicloud.dev")
      const res = await fetch(`${API_URL}/v1/admin/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          status: "new"
        })
      })

      if (!res.ok) {
        throw new Error(language === "en" ? "Failed to submit feedback. Please try again." : "Gagal mengirim ulasan. Silakan coba lagi.")
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const translations = {
    en: {
      title: "User Feedback",
      subtitle: "We value your thoughts! Let us know how we can improve your experience.",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your full name",
      ratingLabel: "Rating",
      categoryLabel: "Category",
      commentLabel: "Your Feedback",
      commentPlaceholder: "Tell us what you think...",
      submitBtn: "Submit Feedback",
      submittingBtn: "Submitting...",
      successTitle: "Thank You!",
      successDesc: "Your feedback has been successfully submitted.",
      submitAnother: "Submit Another Response",
      categories: {
        general: "General Inquiry",
        bug: "Report a Bug",
        feature_request: "Feature Request"
      }
    },
    id: {
      title: "Ulasan Pengguna",
      subtitle: "Pendapat Anda sangat berharga! Beri tahu kami bagaimana kami dapat berkembang.",
      nameLabel: "Nama Anda",
      namePlaceholder: "Masukkan nama lengkap",
      ratingLabel: "Penilaian",
      categoryLabel: "Kategori",
      commentLabel: "Ulasan Anda",
      commentPlaceholder: "Ceritakan pengalaman Anda...",
      submitBtn: "Kirim Ulasan",
      submittingBtn: "Mengirim...",
      successTitle: "Terima Kasih!",
      successDesc: "Ulasan Anda telah berhasil dikirim.",
      submitAnother: "Kirim Respon Lain",
      categories: {
        general: "Pertanyaan Umum",
        bug: "Laporkan Bug",
        feature_request: "Permintaan Fitur"
      }
    }
  }

  const t = translations[language as "en" | "id"] || translations.en

  return (
    <div className="w-full h-full flex items-center justify-center p-4 lg:p-8 animate-fade-in relative overflow-y-auto overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[80px] bg-blue-500/20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] bg-indigo-500/20 animate-pulse pointer-events-none" />

      <div className={`w-full max-w-2xl relative z-10 backdrop-blur-xl border rounded-[30px] p-8 md:p-12 shadow-2xl transition-all duration-500 ${
        theme === "light" 
          ? "bg-white/70 border-white/80 shadow-blue-500/10" 
          : "bg-slate-900/60 border-white/10 shadow-black/50"
      }`}>
        
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg ${
            theme === "light" ? "bg-blue-100 text-blue-600" : "bg-blue-900/50 text-blue-400"
          }`}>
            <MessageSquare size={32} />
          </div>
          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-3 ${
            theme === "light" ? "text-slate-900" : "text-white"
          }`}>
            {t.title}
          </h1>
          <p className={`text-sm md:text-base ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            {t.subtitle}
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 animate-scale-in">
            <CheckCircle size={64} className="text-emerald-500 mb-6 drop-shadow-lg" />
            <h2 className={`text-2xl font-bold mb-2 ${theme === "light" ? "text-slate-800" : "text-slate-100"}`}>
              {t.successTitle}
            </h2>
            <p className={`text-center mb-8 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              {t.successDesc}
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({ ...formData, content: "" }) // Reset content only, keep name
              }}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t.submitAnother}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  <User size={16} /> {t.nameLabel}
                </label>
                <input
                  required
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
                    theme === "light" 
                      ? "bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800" 
                      : "bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-slate-500"
                  }`}
                />
              </div>

              {/* Category Input */}
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  <Layers size={16} /> {t.categoryLabel}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 appearance-none ${
                    theme === "light" 
                      ? "bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800" 
                      : "bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white cursor-pointer"
                  }`}
                >
                  <option value="general">{t.categories.general}</option>
                  <option value="bug">{t.categories.bug}</option>
                  <option value="feature_request">{t.categories.feature_request}</option>
                </select>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-3 pt-2">
              <label className={`flex items-center gap-2 text-sm font-semibold ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                <Star size={16} /> {t.ratingLabel}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star.toString() })}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                      parseInt(formData.rating) >= star
                        ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                        : theme === "light" ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    <Star size={32} fill={parseInt(formData.rating) >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-2 pt-2">
              <label className={`flex items-center gap-2 text-sm font-semibold ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                <MessageSquare size={16} /> {t.commentLabel}
              </label>
              <textarea
                required
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder={t.commentPlaceholder}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 resize-none ${
                  theme === "light" 
                    ? "bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800" 
                    : "bg-slate-950/50 border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-slate-500"
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.customer_name || !formData.content}
              className={`w-full py-4 mt-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg text-white transition-all duration-300 shadow-xl ${
                loading || !formData.customer_name || !formData.content
                  ? "bg-slate-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/30 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.submittingBtn}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t.submitBtn}
                </>
              )}
            </button>
            
          </form>
        )}
      </div>
    </div>
  )
}

export default Feedback
