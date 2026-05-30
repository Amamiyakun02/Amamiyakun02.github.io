import { useState, useRef, useEffect } from "react"
import { Mail, Send, CheckCircle2, MessageSquare, Terminal as TerminalIcon, Sparkles } from "lucide-react"
import { useApp } from "../context/AppContext"

type TerminalLine = {
  text: string
  type: "input" | "system" | "success" | "error" | "green"
}

const Contact = () => {
  const { t, language } = useApp()

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Terminal State
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const terminalBodyRef = useRef<HTMLDivElement>(null)

  // Reset/Initialize Terminal when language changes
  useEffect(() => {
    setTerminalLines([
      { text: "Stargazer Core Engine v2.4.1 (Linux amd64)", type: "system" },
      {
        text: language === "en"
          ? "Type '/help' to list available subroutines."
          : "Ketik '/help' untuk melihat subroutine yang tersedia.",
        type: "system"
      },
      { text: "", type: "system" }
    ])
  }, [language])

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalLines])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsSubmitting(true)

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Inject message notification into terminal!
      if (language === "en") {
        setTerminalLines(prev => [
          ...prev,
          { text: `Guest@stargazer-srv:~$ /send-message --sender "${name}" --email "${email}"`, type: "input" },
          { text: "Encrypting package...", type: "system" },
          { text: "Transmission: SUCCESS", type: "green" },
          { text: `Message queued: "Thank you ${name}, I will get in touch with you shortly!"`, type: "success" },
          { text: "", type: "system" }
        ])
      } else {
        setTerminalLines(prev => [
          ...prev,
          { text: `Guest@stargazer-srv:~$ /kirim-pesan --pengirim "${name}" --email "${email}"`, type: "input" },
          { text: "Mengenkripsi paket pesan...", type: "system" },
          { text: "Pengiriman: SUKSES", type: "green" },
          { text: `Pesan antrean: "Terima kasih ${name}, saya akan segera menghubungi Anda!"`, type: "success" },
          { text: "", type: "system" }
        ])
      }

      // Clear fields
      setName("")
      setEmail("")
      setMessage("")
    }, 1500)
  }

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const rawCmd = terminalInput.trim()
    if (!rawCmd) return

    const newLines = [...terminalLines, { text: `Guest@stargazer-srv:~$ ${rawCmd}`, type: "input" as const }]
    const lowerCmd = rawCmd.toLowerCase()

    if (lowerCmd === "/help") {
      if (language === "en") {
        newLines.push(
          { text: "Available subroutines:", type: "system" },
          { text: "  /ping     - Check low-latency network connection", type: "system" },
          { text: "  /about    - Query core developer personality matrices", type: "system" },
          { text: "  /skills   - Check engineering skill arrays", type: "system" },
          { text: "  /matrix   - Initialize falling code projection stream", type: "system" },
          { text: "  /clear    - Purge console buffers", type: "system" }
        )
      } else {
        newLines.push(
          { text: "Subroutine yang tersedia:", type: "system" },
          { text: "  /ping     - Cek koneksi jaringan latensi rendah", type: "system" },
          { text: "  /about    - Meminta profil dan jati diri pengembang", type: "system" },
          { text: "  /skills   - Memeriksa keahlian aktif pengembang", type: "system" },
          { text: "  /matrix   - Luncurkan aliran proyeksi kode digital", type: "system" },
          { text: "  /clear    - Bersihkan buffer konsol layar", type: "system" }
        )
      }
    } else if (lowerCmd === "/ping") {
      newLines.push(
        { text: "PING amamiya-srv.local (127.0.0.1) 56(84) bytes of data.", type: "system" },
        { text: "64 bytes from localhost: icmp_seq=1 ttl=64 time=0.04 ms", type: "green" },
        { text: "64 bytes from localhost: icmp_seq=2 ttl=64 time=0.05 ms", type: "green" },
        { text: "--- amamiya-srv.local ping statistics ---", type: "system" },
        { text: "2 packets transmitted, 2 received, 0% packet loss, time 1002ms", type: "system" },
        {
          text: language === "en"
            ? "Connection status: EXCELLENT (System online)"
            : "Status Koneksi: SANGAT BAIK (Sistem online)",
          type: "success"
        }
      )
    } else if (lowerCmd === "/about") {
      if (language === "en") {
        newLines.push(
          { text: "Subject Name  : Amamiya (Maireza)", type: "system" },
          { text: "Classification: A.I Engineer & Linux Toolsmith", type: "system" },
          { text: "Directive     : 'Build once, useful forever' - engineer smart scripts & AI integrations.", type: "success" }
        )
      } else {
        newLines.push(
          { text: "Nama Subjek   : Amamiya (Maireza)", type: "system" },
          { text: "Klasifikasi   : Rekayasa A.I & Linux Toolsmith", type: "system" },
          { text: "Petunjuk Inti : 'Sekali buat, berguna selamanya' - merakit skrip cerdas & integrasi AI.", type: "success" }
        )
      }
    } else if (lowerCmd === "/skills") {
      if (language === "en") {
        newLines.push(
          { text: "Active skill modules:", type: "system" },
          { text: "  - [AI/ML]      Python, PyTorch, LangChain, OpenAI/Gemini SDKs, RAG Systems", type: "green" },
          { text: "  - [Web Dev]    TypeScript, React, Next.js, TailwindCSS, Node.js", type: "green" },
          { text: "  - [Systems]    Linux Admin, Shell Scripting, Docker, Git CI/CD", type: "green" }
        )
      } else {
        newLines.push(
          { text: "Modul keahlian aktif:", type: "system" },
          { text: "  - [AI/ML]      Python, PyTorch, LangChain, SDK OpenAI/Gemini, Sistem RAG", type: "green" },
          { text: "  - [Web Dev]    TypeScript, React, Next.js, TailwindCSS, Node.js", type: "green" },
          { text: "  - [Sistem]     Admin Linux, Pembuatan Skrip Shell, Docker, Git CI/CD", type: "green" }
        )
      }
    } else if (lowerCmd === "/matrix") {
      newLines.push(
        { text: "01000001 01001101 01000001 01001101 01001001 01011001 01000001", type: "green" },
        {
          text: language === "en"
            ? ">>>>>>>> LOADING STARGAZER PROTOCOL <<<<<<<<"
            : ">>>>>>>> MEMUAT PROTOKOL STARGAZER <<<<<<<<",
          type: "green"
        },
        { text: "10110100 11001010 01101001 11010110 10010011 00110101 11100011", type: "green" }
      )
    } else if (lowerCmd === "/clear") {
      setTerminalLines([])
      setTerminalInput("")
      return
    } else {
      if (language === "en") {
        newLines.push(
          { text: `Error: command '${rawCmd}' unrecognized.`, type: "error" },
          { text: "Check your spelling or type '/help' to view valid nodes.", type: "system" }
        )
      } else {
        newLines.push(
          { text: `Error: perintah '${rawCmd}' tidak dikenali.`, type: "error" },
          { text: "Periksa kembali ejaan Anda atau ketik '/help' untuk melihat subroutine valid.", type: "system" }
        )
      }
    }

    newLines.push({ text: "", type: "system" })
    setTerminalLines(newLines)
    setTerminalInput("")
  }

  return (
    <div className="w-full min-h-0 h-full flex flex-col justify-start items-stretch p-6 md:p-10 text-slate-100">

      {/* Header */}
      <div className="mb-6 animate-fade-in flex-shrink-0">
        <div className="flex items-center gap-3 text-blue-400 font-semibold uppercase tracking-wider text-xs md:text-sm">
          <Mail size={16} />
          <span>{t("contactBanner")}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
          {t("contactTitle")}
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-2">
          {t("contactDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start w-full">
        {/* Left Column: Form & Tiles */}
        <div className="space-y-6">

          {/* Direct channels tiles */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href="https://wa.me/6283863450720"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-slate-900/30 border border-white/[0.04] rounded-2xl p-4 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 group"
            >
              <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20 group-hover:scale-110 transition-transform">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">WhatsApp</h4>
                <p className="text-xs text-slate-400">{language === "en" ? "Instant Chat" : "Pesan Instan"}</p>
              </div>
            </a>

            <a
              href="mailto:amamiyakun02@gmail.com"
              className="flex items-center gap-3 bg-slate-900/30 border border-white/[0.04] rounded-2xl p-4 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Email</h4>
                <p className="text-xs text-slate-400">{language === "en" ? "Direct Inbox" : "Kotak Masuk"}</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="bg-slate-900/30 border border-white/[0.04] rounded-2xl p-5 md:p-6 relative overflow-hidden">
            {isSubmitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="p-4 bg-green-500/15 rounded-full text-green-400 border border-green-500/20 mb-4 animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{t("contactSuccessTitle")}</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm">
                  {t("contactSuccessDesc")}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-xl transition"
                >
                  {t("contactSuccessBtn")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400">{t("contactLabelName")}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Amamiya"
                      className="input-glass"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400">{t("contactLabelEmail")}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. [EMAIL_ADDRESS]"
                      className="input-glass"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400">{t("contactLabelMessage")}</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={language === "en" ? "Describe your project, ideas, or questions here..." : "Deskripsikan proyek, ide koding, atau pertanyaan Anda di sini..."}
                    className="input-glass resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition duration-200 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t("contactButtonSubmitting")}</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>{t("contactButtonSubmit")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Terminal Emulator */}
        <div className="flex flex-col h-[385px] md:h-[420px] bg-[#030712]/90 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <TerminalIcon size={14} className="text-blue-400" />
              <span className="text-[11px] font-bold font-mono text-slate-400 tracking-wider">STARGAZER SHELL HANDLER</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            </div>
          </div>

          {/* Terminal Body */}
          <div ref={terminalBodyRef} className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin">
            {terminalLines.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === "input"
                    ? "text-blue-300 font-semibold"
                    : line.type === "green"
                      ? "text-emerald-400"
                      : line.type === "success"
                        ? "text-blue-400 font-bold"
                        : line.type === "error"
                          ? "text-rose-400 font-bold"
                          : "text-slate-400"
                }
              >
                {line.text}
              </div>
            ))}

          </div>

          {/* Terminal Command Input */}
          <form onSubmit={handleTerminalCommand} className="flex border-t border-white/[0.04] bg-slate-950/70 p-2 font-mono">
            <span className="text-blue-400 text-xs font-bold px-2 self-center select-none">Guest@stargazer-srv:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={e => setTerminalInput(e.target.value)}
              placeholder={language === "en" ? "e.g. /ping or /skills..." : "misal: /ping atau /skills..."}
              className="flex-1 bg-transparent text-slate-100 border-none outline-none font-mono text-xs focus:ring-0 placeholder-slate-700 py-1"
            />
            <button type="submit" className="p-1.5 text-blue-400 hover:text-white transition">
              <Sparkles size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
