import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Sparkles, ChevronUp, Trash2 } from "lucide-react"
import { useApp } from "../context/AppContext"
import avatarRobin from "../assets/images/robin.jpg"

type Message = {
  id?: string
  sender: "ai" | "user"
  text: string
  timestamp: string
}

const suggestions = {
  openai: {
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
  },
  gemini: {
    en: [
      "Tell me about your Linux scripting.",
      "What is your educational background?",
      "Show me some of your recent works.",
      "How can we collaborate together?"
    ],
    id: [
      "Ceritakan tentang penulisan skrip Linux Anda.",
      "Bagaimana latar belakang pendidikan Anda?",
      "Tampilkan beberapa proyek terbaru Anda.",
      "Bagaimana cara kita berkolaborasi?"
    ]
  }
}



const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const highlightCode = (code: string, lang: string): string => {
  const escaped = escapeHtml(code);
  const l = lang.toLowerCase().trim();
  let highlighted = escaped;

  // 1. Extract and store comments to protect them from keyword highlighting
  const comments: string[] = [];
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/|\/\/.*|#.*)/g, (match) => {
    const id = `___COMMENT_TOKEN_${comments.length}___`;
    comments.push(match);
    return id;
  });

  // 2. Extract and store strings to protect them from keyword highlighting
  const strings: string[] = [];
  highlighted = highlighted.replace(/(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;|`[\s\S]*?`)/g, (match) => {
    const id = `___STRING_TOKEN_${strings.length}___`;
    strings.push(match);
    return id;
  });

  // 3. Keywords matching
  const keywordsMap: Record<string, string[]> = {
    python: ["def", "class", "return", "if", "else", "elif", "for", "while", "import", "from", "as", "try", "except", "with", "lambda", "in", "is", "not", "and", "or", "pass", "global", "nonlocal", "yield", "assert", "break", "continue", "del"],
    js: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "import", "from", "export", "default", "class", "extends", "new", "this", "try", "catch", "finally", "async", "await", "typeof", "instanceof", "in", "of", "break", "continue", "switch", "case", "throw"],
    ts: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "import", "from", "export", "default", "class", "extends", "new", "this", "try", "catch", "finally", "async", "await", "typeof", "instanceof", "in", "of", "break", "continue", "switch", "case", "throw", "interface", "type", "enum", "implements", "readonly", "namespace", "as", "keyof", "declare", "public", "private", "protected", "static", "get", "set"],
    go: ["func", "package", "import", "return", "if", "else", "for", "range", "var", "const", "type", "struct", "interface", "map", "chan", "go", "select", "switch", "case", "default", "defer", "nil", "break", "continue", "fallthrough"],
    php: ["function", "return", "if", "else", "elseif", "for", "foreach", "while", "class", "public", "private", "protected", "new", "this", "use", "namespace", "echo", "try", "catch", "as", "extends", "implements", "break", "continue", "switch", "case", "default"],
    bash: ["echo", "if", "then", "else", "elif", "fi", "for", "while", "do", "done", "in", "case", "esac", "function", "return", "exit", "local", "sudo", "alias", "export", "grep", "awk", "sed", "curl", "wget", "git", "cd", "ls", "mkdir", "rm"],
    sql: ["SELECT", "FROM", "WHERE", "INSERT", "INTO", "UPDATE", "SET", "DELETE", "JOIN", "ON", "LEFT", "RIGHT", "INNER", "OUTER", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "CREATE", "TABLE", "INDEX", "DROP", "ALTER", "AND", "OR", "IN", "NOT", "NULL", "AS", "select", "from", "where", "insert", "into", "update", "set", "delete", "join", "on", "group", "by", "order", "limit", "and", "or", "not", "null", "as", "VALUES", "values", "COUNT", "count", "SUM", "sum", "MAX", "max", "MIN", "min", "AVG", "avg"]
  };

  const defaultKeywords = ["if", "else", "for", "while", "return", "class", "import", "const", "var", "let", "function", "def", "func", "fn", "struct", "package", "type", "interface", "new", "try", "catch", "break", "continue", "switch", "case"];

  const lookupLang = l === "typescript" || l === "tsx" ? "ts" : l === "javascript" || l === "jsx" ? "js" : l === "golang" ? "go" : l === "shell" || l === "sh" ? "bash" : l;
  const keywords = keywordsMap[lookupLang] || defaultKeywords;

  // Keyword highlighting
  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  highlighted = highlighted.replace(keywordRegex, '<span style="color: #ff79c6; font-weight: bold;">$1</span>');

  // 4. Built-in types and values
  const typesMap: Record<string, string[]> = {
    python: ["str", "int", "float", "bool", "list", "dict", "tuple", "set", "True", "False", "None", "self", "print", "len", "range"],
    js: ["true", "false", "null", "undefined", "NaN", "console", "log", "window", "document", "Object", "Array", "String", "Number", "Boolean", "JSON", "Promise", "Math"],
    ts: ["true", "false", "null", "undefined", "NaN", "console", "log", "window", "document", "Object", "Array", "String", "Number", "Boolean", "JSON", "Promise", "Math", "string", "number", "boolean", "any", "void", "unknown", "never"],
    go: ["string", "int", "int32", "int64", "float32", "float64", "bool", "error", "nil", "true", "false", "make", "append", "panic", "recover", "len", "cap", "print", "println"],
    php: ["true", "false", "null", "int", "float", "string", "bool", "array", "object", "count", "isset", "empty"]
  };

  const defaultTypes = ["true", "false", "null", "undefined", "string", "number", "boolean", "void", "any", "nil", "None", "self", "error", "int", "float", "bool"];
  const types = typesMap[lookupLang] || defaultTypes;
  const typeRegex = new RegExp(`\\b(${types.join("|")})\\b`, "g");
  highlighted = highlighted.replace(typeRegex, '<span style="color: #bd93f9;">$1</span>');

  // 5. Functions
  highlighted = highlighted.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span style="color: #50fa7b;">$1</span>');

  // 6. Numbers
  highlighted = highlighted.replace(/\b(\d+(\.\d+)?)\b/g, '<span style="color: #ffb86c;">$1</span>');

  // Restore strings
  strings.forEach((str, idx) => {
    highlighted = highlighted.replace(`___STRING_TOKEN_${idx}___`, `<span style="color: #f1fa8c;">${str}</span>`);
  });

  // Restore comments
  comments.forEach((comment, idx) => {
    highlighted = highlighted.replace(`___COMMENT_TOKEN_${idx}___`, `<span style="color: #6272a4; font-style: italic;">${comment}</span>`);
  });

  return highlighted;
};


const OpenAILogo = ({ className = "w-3.5 h-3.5", isActive = false }: { className?: string, isActive?: boolean }) => {
  return (
    <img
      src="/openai.svg"
      className={`${className} object-contain transition-all duration-200 ${isActive
        ? "brightness-0 invert opacity-100"
        : "brightness-0 invert opacity-60 hover:opacity-100"
        }`}
      alt="OpenAI"
    />
  )
}

const GeminiLogo = ({ className = "w-3.5 h-3.5", isActive = false }: { className?: string, isActive?: boolean }) => {
  return (
    <img
      src="/gemini.svg"
      className={`${className} object-contain transition-all duration-200 ${isActive
        ? "opacity-100"
        : "opacity-60 hover:opacity-100"
        }`}
      alt="Gemini"
    />
  )
}


const Assistant = () => {
  const { t, language } = useApp()

  const [selectedModel, setSelectedModel] = useState<"openai" | "gemini">(() => {
    const saved = localStorage.getItem("assistant_selected_model")
    return (saved === "openai" || saved === "gemini") ? saved : "openai"
  })
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const chatLogRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Persistent unique user_id to enable session-based conversational memory on the backend!
  const [userId] = useState(() => {
    let id = localStorage.getItem("assistant_user_id")
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 11)
      localStorage.setItem("assistant_user_id", id)
    }
    return id
  })

  // Load saved chat history or initialize welcome message when language or selectedModel changes
  useEffect(() => {
    const saved = localStorage.getItem(`assistant_chat_history_${selectedModel}`)
    
    if (saved) {
      const parsed = JSON.parse(saved) as Message[]
      // If we have history, load it.
      // But if the history only contains 1 welcome message from AI, we can regenerate it in the correct language!
      if (parsed.length === 1 && parsed[0].sender === "ai") {
        const modelLabel = selectedModel === "openai" ? "OpenAI GPT-5.4" : "Google Gemini-3.5"
        const welcomeText = language === "en"
          ? `Hello! I am Robin, Amamiya's dynamic AI Assistant (powered by ${modelLabel}). Ask me anything about Amamiya's engineering skills, Linux scripting experience, projects, or how to hire him!`
          : `Halo! Saya Robin, Asisten AI Amamiya yang dinamis (ditenagai oleh ${modelLabel}). Tanyakan apa saja kepada saya tentang keahlian rekayasa Amamiya, pengalaman penulisan skrip Linux, proyek-proyeknya, atau cara merekrutnya!`
        
        const newWelcomeMsg: Message = {
          sender: "ai",
          text: welcomeText,
          timestamp: parsed[0].timestamp // keep original timestamp
        }
        setMessages([newWelcomeMsg])
        localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify([newWelcomeMsg]))
      } else {
        setMessages(parsed)
      }
    } else {
      const modelLabel = selectedModel === "openai" ? "OpenAI GPT-5.4" : "Google Gemini-3.5"
      const welcomeText = language === "en"
        ? `Hello! I am Robin, Amamiya's dynamic AI Assistant (powered by ${modelLabel}). Ask me anything about Amamiya's engineering skills, Linux scripting experience, projects, or how to hire him!`
        : `Halo! Saya Robin, Asisten AI Amamiya yang dinamis (ditenagai oleh ${modelLabel}). Tanyakan apa saja kepada saya tentang keahlian rekayasa Amamiya, pengalaman penulisan skrip Linux, proyek-proyeknya, atau cara merekrutnya!`

      const initialMsg: Message = {
        sender: "ai",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([initialMsg])
      localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify([initialMsg]))
    }
    
    // Save selected model preference
    localStorage.setItem("assistant_selected_model", selectedModel)
  }, [language, selectedModel])

  const handleClearChat = () => {
    const confirmMessage = language === "en"
      ? "Are you sure you want to clear the conversation history?"
      : "Apakah Anda yakin ingin menghapus riwayat percakapan?";
    
    if (window.confirm(confirmMessage)) {
      localStorage.removeItem(`assistant_chat_history_${selectedModel}`)
      
      const modelLabel = selectedModel === "openai" ? "OpenAI GPT-5.4" : "Google Gemini-3.5";
      const welcomeText = language === "en"
        ? `Hello! I am Robin, Amamiya's dynamic AI Assistant (powered by ${modelLabel}). Ask me anything about Amamiya's engineering skills, Linux scripting experience, projects, or how to hire him!`
        : `Halo! Saya Robin, Asisten AI Amamiya yang dinamis (ditenagai oleh ${modelLabel}). Tanyakan apa saja kepada saya tentang keahlian rekayasa Amamiya, pengalaman penulisan skrip Linux, proyek-proyeknya, atau cara merekrutnya!`;

      const initialMsg: Message = {
        sender: "ai",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([initialMsg])
      localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify([initialMsg]))
    }
  }

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const triggerAIResponse = async (userQuery: string, currentMessages: Message[]) => {
    setIsTyping(true)
    let aiMessageId = ""
    let streamedText = ""

    try {
      // Map complete message history (excluding welcome message at index 0 to guarantee starting with "user" role)
      const apiMessages = currentMessages.slice(1).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }))

      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const baseUrl = isLocalhost ? "http://127.0.0.1:8000" : "https://myagentic-apps.fastapicloud.dev";
      const endpoint = selectedModel === "openai"
        ? `${baseUrl}/v1/assistant/chat`
        : `${baseUrl}/v1/gemini/chat`

      const response = await fetch(endpoint, {
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

      // Real-Time Chunk Streaming with Robust JSON Fallback check
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Response body is not readable")
      }

      const decoder = new TextDecoder()
      let done = false
      let buffer = ""
      let isFirstChunk = true

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (value) {
          buffer += decoder.decode(value, { stream: !done })

          if (isFirstChunk) {
            isFirstChunk = false
            const trimmed = buffer.trim()
            if (trimmed.startsWith("{") && !trimmed.includes("data:")) {
              // Plain JSON response fallback (e.g. immediate error or JSON payload)
              try {
                const data = JSON.parse(trimmed)
                
                if (data.error) {
                  throw new Error(data.error)
                }

                const responseText = data.response || data.text || data.reply || data.message || JSON.stringify(data)

                setMessages(prev => {
                  const finalMessages = [
                    ...prev,
                    {
                      sender: "ai",
                      text: responseText,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]
                  localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify(finalMessages))
                  return finalMessages
                })
                setIsTyping(false)
                return
              } catch (e) {
                // If it was a real thrown error from data.error, rethrow it
                if (e instanceof Error && e.message && !e.message.startsWith("Unexpected token")) {
                  throw e
                }
                // Not complete JSON yet, continue to stream parsing
              }
            }

            // Create placeholder message in state for SSE streaming
            aiMessageId = "stream_" + Date.now()
            setMessages(prev => [
              ...prev,
              {
                id: aiMessageId,
                sender: "ai",
                text: "",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ])
            setIsTyping(false)
          }

          // Process complete SSE lines
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (trimmedLine.startsWith("data: ")) {
              try {
                const jsonStr = trimmedLine.substring(6).trim()
                if (jsonStr) {
                  if (jsonStr === "[DONE]") {
                    done = true
                    break
                  }
                  const parsed = JSON.parse(jsonStr)
                  
                  if (parsed.error) {
                    throw new Error(parsed.error)
                  }

                  if (parsed.text) {
                    streamedText += parsed.text
                    // Push live update to corresponding message bubble
                    setMessages(prev =>
                      prev.map(msg =>
                        msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
                      )
                    )
                  }
                }
              } catch (e) {
                // Rethrow stream errors to catch block to handle it correctly
                if (e instanceof Error && e.message && !e.message.startsWith("Unexpected token")) {
                  throw e
                }
              }
            }
          }
        }
      }

      // Process any leftover content in the buffer
      if (buffer.trim().startsWith("data: ")) {
        try {
          const jsonStr = buffer.trim().substring(6).trim()
          if (jsonStr && jsonStr !== "[DONE]") {
            const parsed = JSON.parse(jsonStr)
            
            if (parsed.error) {
              throw new Error(parsed.error)
            }

            if (parsed.text) {
              streamedText += parsed.text
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
                )
              )
            }
          }
        } catch (e) {
          if (e instanceof Error && e.message && !e.message.startsWith("Unexpected token")) {
            throw e
          }
        }
      }

      // Persist the final completed stream history to localStorage
      if (aiMessageId && streamedText) {
        setMessages(prev => {
          const finalMessages = prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
          )
          localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify(finalMessages))
          return finalMessages
        })
      }

    } catch (error) {
      console.error("AI response error:", error)
      const assistantName = selectedModel === "openai" ? "Robin" : "Luna"
      const rawErrorMsg = error instanceof Error ? error.message : String(error)
      const isSystemError = rawErrorMsg.includes("Server communication failed") || rawErrorMsg.includes("Response body is not readable") || rawErrorMsg.includes("failed to fetch")
      
      const errorText = language === "en"
        ? (isSystemError ? `Apologies, I encountered an issue establishing a secure link with ${assistantName}'s server terminal. Please verify your connection or try again.` : `Error: ${rawErrorMsg}`)
        : (isSystemError ? `Mohon maaf, saya mengalami kegagalan transmisi data dengan terminal server ${assistantName}. Silakan periksa koneksi Anda atau coba lagi.` : `Error: ${rawErrorMsg}`)

      setMessages(prev => {
        let finalMessages: Message[]
        if (aiMessageId) {
          finalMessages = prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: errorText } : msg
          )
        } else {
          finalMessages = [
            ...prev,
            {
              sender: "ai",
              text: errorText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }
        localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify(finalMessages))
        return finalMessages
      })
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

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify(updatedMessages))
    setInputText("")
    triggerAIResponse(text, updatedMessages)
  }

  const handleSuggestionClick = (suggestion: string) => {
    const userMsg: Message = {
      sender: "user",
      text: suggestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    localStorage.setItem(`assistant_chat_history_${selectedModel}`, JSON.stringify(updatedMessages))
    triggerAIResponse(suggestion, updatedMessages)
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

  // Helper to parse dynamic code blocks (markdown syntax ```lang ... ```)
  const parseMessageContent = (text: string) => {
    const parts = text.split("```")
    return parts.map((part, index) => {
      const isCodeBlock = index % 2 === 1

      if (isCodeBlock) {
        // Extract language and code content
        const lines = part.split("\n")
        const firstLine = lines[0].trim()

        // Dynamically match any alphanumeric language identifier (e.g. js, go, cpp, rust)
        const language = /^[a-zA-Z0-9#+-]+$/.test(firstLine) ? firstLine : ""
        const code = language ? lines.slice(1).join("\n").trim() : part.trim()

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#282a36] font-mono shadow-2xl flex flex-col items-stretch max-w-full glass-card select-text">
            {/* Header console bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-white/[0.04] text-[10px] uppercase font-bold tracking-wider text-slate-400 select-none flex-shrink-0">
              <span className="text-cyan-400">{language || "code"}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(code)
                  alert(language === "id" ? "Kode berhasil disalin!" : "Code copied to clipboard!")
                }}
                className="text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 rounded border border-white/5 transition duration-150 active:scale-95 text-[9px] font-bold uppercase tracking-wider"
              >
                Copy
              </button>
            </div>
            {/* Syntax-highlight styled container */}
            <pre className="p-4 text-xs overflow-x-auto scrollbar-thin leading-relaxed text-slate-300">
              <code dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
            </pre>
          </div>
        )
      } else {
        return (
          <div key={index} className="space-y-1.5 whitespace-pre-wrap">
            {renderMessageText(part)}
          </div>
        )
      }
    })
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col justify-between items-stretch p-3 pb-28 pt-2 md:p-6 text-slate-100">
      {/* Sleek Compact Header */}
      <div className="animate-fade-in flex-shrink-0 flex items-center justify-between border-b border-white/[0.04] pb-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white leading-none">
              {t("assistantTitle")}
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 select-none">
              {selectedModel === "openai" ? "Amamiya's Personal AI Assistant (OpenAI Edition)" : "Amamiya's Personal AI Assistant (Gemini-3.5 Edition)"}
            </p>
          </div>
        </div>
        
        {/* Clear Chat Button */}
        <button
          type="button"
          onClick={handleClearChat}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900/40 border border-white/[0.04] hover:border-rose-500/25 hover:bg-rose-500/5 transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
          title={language === "en" ? "Clear conversation history" : "Hapus riwayat percakapan"}
        >
          <Trash2 size={12} />
          <span className="hidden sm:inline">{language === "en" ? "Clear Chat" : "Hapus Chat"}</span>
        </button>
      </div>

      {/* Chat Area - Expanded to occupy 100% dynamic height! */}
      <div ref={chatLogRef} className="flex-1 my-3 bg-slate-950/40 border border-white/[0.04] rounded-2xl p-4 md:p-6 overflow-y-auto flex flex-col gap-4 no-scrollbar min-h-0">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}
          >
            {/* Avatar */}
            {msg.sender === "user" ? (
              <div className="rounded-xl flex-shrink-0 border border-blue-600/20 bg-blue-600/10 h-9 w-9 flex items-center justify-center text-blue-400 shadow-sm">
                <User size={16} />
              </div>
            ) : (
              <div className={`rounded-xl flex-shrink-0 border overflow-hidden h-9 w-9 flex items-center justify-center shadow-sm transition-all duration-300 ${selectedModel === "openai"
                ? "border-blue-500/30 bg-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.25)]"
                : "border-purple-500/30 bg-slate-950 shadow-[0_0_10px_rgba(168,85,247,0.25)]"
                }`}>
                <img
                  src={avatarRobin}
                  alt="Robin"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Bubble */}
            <div className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${msg.sender === "user"
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-slate-900/60 text-slate-300 border border-white/[0.03] rounded-tl-none"
              }`}>
              <div className="space-y-1.5">
                {parseMessageContent(msg.text)}
              </div>
              <div className={`text-[9px] mt-1.5 text-right select-none ${msg.sender === "user" ? "text-blue-200" : "text-slate-500"
                }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* AI Typing Animation */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className={`rounded-xl border overflow-hidden h-9 w-9 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${selectedModel === "openai"
              ? "border-blue-500/30 bg-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.25)]"
              : "border-purple-500/30 bg-slate-950 shadow-[0_0_10px_rgba(168,85,247,0.25)]"
              }`}>
              <img
                src={avatarRobin}
                alt="Robin"
                className="w-full h-full object-cover"
              />
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
      <div className="space-y-3 flex-shrink-0">
        {/* Suggestion Chips - Only show when there are no user messages to save vertical space! */}
        {messages.filter(m => m.sender === "user").length === 0 && (
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 select-none flex-nowrap w-full">
            {suggestions[selectedModel][language].map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="text-[11px] md:text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/40 border border-white/[0.04] hover:border-blue-500/35 hover:bg-slate-900/60 px-3.5 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 flex-shrink-0"
              >
                <Sparkles size={11} className="text-blue-500" />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          {/* Premium Upward-Floating Model Selector Dropdown next to chat input */}
          <div ref={dropdownRef} className="relative flex-shrink-0 select-none">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`h-11 px-2.5 sm:px-3.5 rounded-xl text-[10px] md:text-xs font-bold uppercase flex items-center gap-1.5 sm:gap-2 border transition-all duration-200 active:scale-95 cursor-pointer ${selectedModel === "openai"
                ? "bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)] hover:bg-blue-600/20"
                : "bg-purple-600/10 border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)] hover:bg-purple-600/20"
                }`}
              title="Select AI Model Engine"
            >
              {selectedModel === "openai" ? (
                <OpenAILogo className="w-3.5 h-3.5 animate-pulse" isActive={true} />
              ) : (
                <GeminiLogo className="w-3.5 h-3.5 animate-pulse" isActive={true} />
              )}
              <span className="hidden sm:inline">{selectedModel === "openai" ? "OpenAI" : "Gemini-3.5"}</span>
              <ChevronUp size={12} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu - Floats upward cleanly above the input bar */}
            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-44 bg-slate-950/95 backdrop-blur-xl border border-white/[0.08] rounded-xl p-1 shadow-2xl z-50 animate-fade-in flex flex-col gap-0.5 shadow-blue-500/5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModel("openai")
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition duration-150 flex items-center gap-2 cursor-pointer ${selectedModel === "openai"
                    ? "bg-blue-600 text-white shadow-md glow-blue"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <OpenAILogo className="w-3.5 h-3.5" isActive={selectedModel === "openai"} />
                  <span>OpenAI</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModel("gemini")
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition duration-150 flex items-center gap-2 cursor-pointer ${selectedModel === "gemini"
                    ? "bg-purple-600 text-white shadow-md glow-purple"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <GeminiLogo className="w-3.5 h-3.5" isActive={selectedModel === "gemini"} />
                  <span>Gemini-3.5</span>
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={language === "en" ? "Ask anything (e.g. 'skills' or 'projects')..." : "Tanyakan apa saja (misal: 'keahlian' atau 'proyek')..."}
            className="flex-1 min-w-0 input-glass h-11"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl h-11 w-11 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Assistant
