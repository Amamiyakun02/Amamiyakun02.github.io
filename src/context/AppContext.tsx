import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type TranslationKey } from "../utils/translations"

type Theme = "dark" | "light"
type Language = "en" | "id"

type AppContextType = {
  theme: Theme
  toggleTheme: () => void
  language: Language
  toggleLanguage: () => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme")
    return (saved === "light" || saved === "dark") ? saved : "dark"
  })

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("lang")
    return (saved === "en" || saved === "id") ? saved : "en"
  })

  // Sync theme changes to document Element class list
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "light") {
      root.classList.remove("dark")
      root.classList.add("light")
    } else {
      root.classList.remove("light")
      root.classList.add("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  // Sync language selection to localStorage
  useEffect(() => {
    localStorage.setItem("lang", language)
  }, [language])

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "en" ? "id" : "en"))
  }

  // Translation helper
  const t = (key: TranslationKey): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language] || translation["en"] || key
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider")
  }
  return context
}
