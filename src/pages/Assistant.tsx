import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Sparkles, AlertCircle } from "lucide-react"
import { useApp } from "../context/AppContext"

type Message = {
  sender: "ai" | "user"
  text: string
  timestamp: string
}

const suggestions = {
  en: [
    "What is your core tech stack?",
    "Tell me about your AI/ML projects.",
    "What is your dev philosophy?",
    "How can I hire or contact you?"
  ],
  id: [
    "Apa teknologi utama Anda?",
    "Ceritakan tentang proyek AI Anda.",
    "Apa filosofi koding Anda?",
    "Bagaimana cara menghubungi Anda?"
  ]
}


const Assistant = () => {
  const { t, language } = useApp()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatLogRef = useRef<HTMLDivElement>(null)

  // Persistent unique user_id to enable session-based conversational memory on the backend!
  const [userId] = useState(() => {
    let id = localStorage.getItem("assistant_user_id")
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 11)
      localStorage.setItem("assistant_user_id", id)
    }
    return id
  })

  // Initialize welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: language === "en" 
          ? "Hello! I am Robin, Amamiya's dynamic AI Assistant. Ask me anything about Amamiya's engineering skills, Linux scripting experience, projects, or how to hire him!"
          : "Halo! Saya Robin, Asisten AI Amamiya yang dinamis. Tanyakan apa saja kepada saya tentang keahlian rekayasa Amamiya, pengalaman penulisan skrip Linux, proyek-proyeknya, atau cara merekrutnya!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }, [language])

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const triggerAIResponse = async (userQuery: string) => {
    setIsTyping(true)
    
    try {
      // Map complete message history to Pydantic-compatible payload schema for persistent memory
      const apiMessages = [
        ...messages.map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        })),
        { role: "user", content: userQuery }
      ]

      const response = await fetch("https://myagentic-apps.fastapicloud.dev/v1/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          messages: apiMessages
        })
      })
      
      if (!response.ok) {
        throw new Error(language === "en" ? "Server communication failed." : "Gagal menghubungi server.")
      }
      
      const rawText = await response.text()
      let responseText = ""
      
      if (rawText.trim().startsWith('{')) {
        // Plain JSON response
        const data = JSON.parse(rawText)
        responseText = data.response || data.text || data.reply || data.message || JSON.stringify(data)
      } else {
        // SSE Stream response chunk concatenation
        const lines = rawText.split('\n')
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.substring(6).trim()
              if (jsonStr) {
                const parsed = JSON.parse(jsonStr)
                if (parsed.text) {
                  responseText += parsed.text
                }
              }
            } catch (e) {
              // Skip malformed chunks
            }
          }
        }
      }

      if (!responseText) {
        throw new Error("Empty response received")
      }
      
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (error) {
      console.error("AI response error:", error)
      const errorText = language === "en"
        ? "Apologies, I encountered an issue establishing a secure link with Robin's server terminal. Please verify your connection or try again."
        : "Mohon maaf, saya mengalami kegagalan transmisi data dengan terminal server Robin. Silakan periksa koneksi Anda atau coba lagi."
      
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: errorText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputText.trim()
    if (!text) return

    // User Message
    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputText("")
    triggerAIResponse(text)
  }

  const handleSuggestionClick = (suggestion: string) => {
    const userMsg: Message = {
      sender: "user",
      text: suggestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    triggerAIResponse(suggestion)
  }

  // Helper to render markdown bullets/links in simple form
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content: React.ReactNode = line

      // Handle Bold bullets
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const cleaned = line.substring(2)
        const parts = cleaned.split('**')
        content = (
          <span className="flex items-start gap-1.5 ml-2 mt-0.5">
            <span className="text-blue-400 mt-1 select-none">▪</span>
            <span>
              {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-white font-bold dark:text-white">{p}</strong> : p)}
            </span>
          </span>
        )
      } else if (line.match(/^\d+\.\s/)) {
        // Numbered list
        const match = line.match(/^(\d+\.\s)(.*)/)
        if (match) {
          const num = match[1]
          const rest = match[2]
          const parts = rest.split('**')
          content = (
            <span className="flex items-start gap-1.5 ml-2 mt-0.5">
              <span className="text-blue-400 font-bold font-mono select-none">{num}</span>
              <span>
                {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-white font-bold dark:text-white">{p}</strong> : p)}
              </span>
            </span>
          )
        }
      } else if (line.startsWith('> ')) {
        // Blockquote
        content = (
          <blockquote className="border-l-2 border-blue-500/50 pl-3 italic text-slate-300 my-1 bg-white/[0.02] py-1 rounded-r-md">
            {line.substring(2)}
          </blockquote>
        )
      } else {
        // Regular line, parse inline bold
        const parts = line.split('**')
        content = parts.map((p, idx) => {
          if (idx % 2 === 1) {
            return <strong key={idx} className="text-white font-bold dark:text-white">{p}</strong>
          }
          
          // Basic check for Markdown Link [text](url)
          const linkMatch = p.match(/\[(.*?)\]\((.*?)\)/)
          if (linkMatch) {
            return (
              <a key={idx} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                {linkMatch[1]}
              </a>
            )
          }
          return p
        })
      }

      return <div key={i} className="min-h-[1.2rem]">{content}</div>
    })
  }

  return (
    <div className="w-full min-h-0 h-full flex flex-col justify-between items-stretch p-6 md:p-10 text-slate-100">
      
      {/* Header */}
      <div className="animate-fade-in flex-shrink-0">
        <div className="flex items-center gap-3 text-blue-400 font-semibold uppercase tracking-wider text-xs md:text-sm">
          <Bot size={16} />
          <span>{t("assistantBanner")}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
          {t("assistantTitle")}
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-2">
          {t("assistantDesc")}
        </p>
      </div>

      {/* Chat Area */}
      <div ref={chatLogRef} className="flex-1 my-6 bg-slate-950/40 border border-white/[0.04] rounded-2xl p-4 md:p-6 overflow-y-auto flex flex-col gap-4 scrollbar-thin max-h-[380px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {/* Avatar */}
            <div className={`p-2 rounded-xl flex-shrink-0 border h-9 w-9 flex items-center justify-center ${
              msg.sender === "user"
                ? "bg-blue-600/10 text-blue-400 border-blue-600/20"
                : "bg-slate-800 text-slate-300 border-white/[0.08]"
            }`}>
              {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${
              msg.sender === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-slate-900/60 text-slate-300 border border-white/[0.03] rounded-tl-none"
            }`}>
              <div className="space-y-1.5">
                {renderMessageText(msg.text)}
              </div>
              <div className={`text-[9px] mt-1.5 text-right select-none ${
                msg.sender === "user" ? "text-blue-200" : "text-slate-500"
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* AI Typing Animation */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-white/[0.08] h-9 w-9 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-slate-900/60 text-slate-300 border border-white/[0.03] flex items-center gap-1.5 h-9">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full typing-dot" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full typing-dot" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full typing-dot" />
            </div>
          </div>
        )}

      </div>

      {/* Suggested Prompts & Input */}
      <div className="space-y-4 flex-shrink-0">
        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          {suggestions[language].map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(sug)}
              className="text-[11px] md:text-xs font-medium text-slate-400 hover:text-white bg-slate-900/40 border border-white/[0.04] hover:border-blue-500/30 hover:bg-slate-900/60 px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1"
            >
              <Sparkles size={10} className="text-blue-500" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={language === "en" ? "Ask anything (e.g. 'skills' or 'projects')..." : "Tanyakan apa saja (misal: 'keahlian' atau 'proyek')..."}
            className="flex-1 input-glass"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl px-4 py-3 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all"
          >
            <Send size={16} />
          </button>
        </form>
        
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1 justify-center md:justify-start">
          <AlertCircle size={12} className="text-blue-500/70" />
          <span>{t("assistantAlert")}</span>
        </div>
      </div>
    </div>
  )
}

export default Assistant
