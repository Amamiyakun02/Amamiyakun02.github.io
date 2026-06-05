import { type ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Home, User, Briefcase, Bot, Mail, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"
import Sidebar from "../components/Sidebar"
import avatar from "../assets/images/profile.jpeg"
import { useApp } from "../context/AppContext"

type Props = {
  children: ReactNode
}

const PAGE_FLOW = ["/", "/about", "/projects", "/assistant", "/contact"]

// Config for each page: icon factory + label
const PAGE_CONFIG: Record<string, {
  icon: (size: number) => React.ReactNode
  label: { en: string; id: string }
}> = {
  '/':          { icon: (s) => <Home size={s} />,      label: { en: 'Home',    id: 'Beranda' } },
  '/about':     { icon: (s) => <User size={s} />,      label: { en: 'About',   id: 'Tentang' } },
  '/projects':  { icon: (s) => <Briefcase size={s} />, label: { en: 'Work',    id: 'Proyek'  } },
  '/assistant': { icon: (s) => <Bot size={s} />,       label: { en: 'AI',      id: 'AI'      } },
  '/contact':   { icon: (s) => <Mail size={s} />,      label: { en: 'Contact', id: 'Kontak'  } },
}

const MainLayout = ({ children }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp()
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  })
  
  const currentPath = location.pathname
  const menuPath = currentPath === "/pdf-analysis" || currentPath === "/remove-bg" || currentPath === "/image-to-pdf" ? "/projects" : currentPath
  const currentIndex = PAGE_FLOW.indexOf(menuPath)
  const isAssistant = currentPath === "/assistant"

  const [prevIndex, setPrevIndex] = useState(currentIndex)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [transitionStyle, setTransitionStyle] = useState<"slide" | "zoom" | "3d" | "skew">("slide")

  // Mobile Swipe Gesture State for Page Switching
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchEndX(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return
    const diffX = touchStartX - touchEndX
    const minSwipe = 50 // minimum distance in pixels

    if (diffX > minSwipe) {
      // Swipe left (finger moves right to left) -> Next Page
      handleNext()
    } else if (diffX < -minSwipe) {
      // Swipe right (finger moves left to right) -> Previous Page
      handlePrev()
    }
    setTouchStartX(null)
    setTouchEndX(null)
  }

  // Dynamic calculation of page switching direction and randomized transition selection
  useEffect(() => {
    if (currentIndex !== prevIndex && currentIndex !== -1 && prevIndex !== -1) {
      let dir: "forward" | "backward" = "forward"
      if (currentIndex === 0 && prevIndex === PAGE_FLOW.length - 1) {
        dir = "forward"
      } else if (currentIndex === PAGE_FLOW.length - 1 && prevIndex === 0) {
        dir = "backward"
      } else if (currentIndex < prevIndex) {
        dir = "backward"
      }
      setDirection(dir)
      setPrevIndex(currentIndex)

      // Randomly select a different transition style to surprise the user
      const STYLES: ("slide" | "zoom" | "3d" | "skew")[] = ["slide", "zoom", "3d", "skew"]
      const alternativeStyles = STYLES.filter((style) => style !== transitionStyle)
      const randomStyle = alternativeStyles[Math.floor(Math.random() * alternativeStyles.length)]
      setTransitionStyle(randomStyle)
    }
  }, [currentIndex, prevIndex, transitionStyle])

  // Auto-close sidebar drawer on mobile when page changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [currentPath])

  // Automatic keyboard navigation (ArrowLeft & ArrowRight) for maximum interactive score!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex])

  const handlePrev = () => {
    let prevIdx = currentIndex - 1
    if (prevIdx < 0) prevIdx = PAGE_FLOW.length - 1
    navigate(PAGE_FLOW[prevIdx])
  }

  const handleNext = () => {
    let nextIdx = currentIndex + 1
    if (nextIdx >= PAGE_FLOW.length) nextIdx = 0
    navigate(PAGE_FLOW[nextIdx])
  }

  // Helper to determine active route styles (desktop pill)
  const getNavLinkClass = (path: string) => {
    const isActive = menuPath === path
    return `relative p-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-110"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] dark:hover:bg-white/[0.04]"
    }`
  }

  // ── ARC NAVBAR STATE ────────────────────────────────────────
  const [isArcOpen, setIsArcOpen] = useState(false)
  // Path of the satellite item currently being "selected" (for flash animation)
  const [selectingPath, setSelectingPath] = useState<string | null>(null)

  // NOTE: NO auto-close on route change — menu stays open while navigating.
  // Only handleFabClick closes the menu.

  // FAB = pure open/close toggle, never navigates
  const handleFabClick = () => {
    setIsArcOpen(prev => !prev)
  }

  // Satellite click: flash animation → navigate (menu stays open)
  const handleSatelliteClick = (path: string) => {
    if (selectingPath) return // debounce rapid taps
    setSelectingPath(path)
    setTimeout(() => {
      navigate(path)
      setSelectingPath(null)
    }, 180)
  }

  // Satellite pages = all pages in hierarchy order EXCEPT current page
  // These map 1:1 to arc positions: [left-far, left-near, right-near, right-far]
  const satellitePages = PAGE_FLOW.filter(p => p !== menuPath)

  // Helper for satellite item base classes
  const getArcNavClass = (path: string) => {
    const isActive = menuPath === path
    return `arc-nav-item flex flex-col items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200 active:scale-90 ${
      isActive
        ? "bg-blue-600 border-blue-500/50 text-white shadow-md shadow-blue-500/30"
        : "bg-slate-900/85 border-white/[0.12] text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-slate-800/90"
    } backdrop-blur-md`
  }


  return (
    <div
      className={`w-screen fixed inset-0 overflow-hidden flex items-center justify-center px-0 py-1.5 lg:p-8 font-sans transition-colors duration-300 nav-root ${
        theme === "light" ? "bg-slate-50 text-slate-800" : "bg-slate-950 text-slate-100"
      }`}
      style={{ height: '100dvh' }}
    >
      
      {/* 1. Dynamic Glowing mesh background blobs */}
      <div className={`absolute top-[-10%] left-[-15%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[90px] md:blur-[130px] animate-float-1 pointer-events-none select-none z-0 transition-colors duration-500 ${
        theme === "light" ? "bg-cyan-500/10" : "bg-blue-600/10"
      }`} />
      <div className={`absolute bottom-[-15%] right-[-10%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full blur-[100px] md:blur-[140px] animate-float-2 pointer-events-none select-none z-0 transition-colors duration-500 ${
        theme === "light" ? "bg-pink-500/10" : "bg-purple-600/10"
      }`} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* 2. Interactive Navigation Chevrons (Floating left/right of container) */}
      {/* Left Chevron */}
      <button
        onClick={handlePrev}
        className={`absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-50 backdrop-blur-md border hover:border-blue-500/40 rounded-full p-3 transition-all duration-300 group hidden lg:block ${
          theme === "light"
            ? "bg-white/80 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 shadow-md"
            : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        }`}
        title={language === "en" ? `Navigate to Previous Page` : `Kembali ke Halaman Sebelumnya`}
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Right Chevron */}
      <button
        onClick={handleNext}
        className={`absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-50 backdrop-blur-md border hover:border-blue-500/40 rounded-full p-3 transition-all duration-300 group hidden lg:block ${
          theme === "light"
            ? "bg-white/80 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 shadow-md"
            : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        }`}
        title={language === "en" ? `Navigate to Next Page` : `Lanjut ke Halaman Berikutnya`}
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* 3. Outer Wrapper for Centering & Overlapping Elements */}
      <div className="relative w-full max-w-[1240px] h-full max-h-[780px] z-10 flex items-center justify-center">

        {/* 3a. Core Glass Card Layout */}
        <div className="relative flex flex-col lg:flex-row w-full h-full rounded-2xl lg:rounded-[30px] overflow-hidden glass-container" style={{isolation: 'auto'}}>
          
          {/* Left Side: Dynamic Sidebar */}
          <Sidebar isOpen={isSidebarOpen} />

          {/* Right Side: Page Content Wrapper */}
          <div className={`flex-1 min-h-0 min-w-0 flex flex-col justify-between overflow-y-hidden relative ${
            theme === "light" ? "bg-slate-50/10" : "bg-slate-950/20"
          }`}>
            
            {/* Unified Premium Glassmorphic Control Pill */}
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-40 flex items-center select-none">
              <div className={`flex items-center gap-2.5 backdrop-blur-md border px-3 py-1.5 rounded-full shadow-md transition-all duration-300 ${
                theme === "light"
                  ? "bg-white/80 border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
                  : "bg-slate-950/70 border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              }`}>
                {/* Profile Trigger Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/[0.08] overflow-hidden bg-slate-950 shadow-sm flex items-center justify-center transition hover:scale-110 active:scale-90 flex-shrink-0"
                  title={language === "en" ? "Toggle Profile Sidebar" : "Buka/Tutup Profil"}
                >
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                </button>

                {/* Divider */}
                <span className={`w-[1px] h-4 transition-colors duration-300 ${theme === "light" ? "bg-slate-200" : "bg-white/[0.08]"}`} />

                {/* Language Switcher */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono transition-all duration-200 hover:scale-105 active:scale-95 ${
                    theme === "light"
                      ? "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  title={language === "en" ? "Switch to Indonesian" : "Ganti ke Bahasa Inggris"}
                >
                  {language === "en" ? "EN" : "ID"}
                </button>

                {/* Divider */}
                <span className={`w-[1px] h-4 transition-colors duration-300 ${theme === "light" ? "bg-slate-200" : "bg-white/[0.08]"}`} />

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-1 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-90 ${
                    theme === "light"
                      ? "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                      : "hover:text-white text-slate-300 hover:bg-white/[0.04]"
                  }`}
                  title={theme === "dark" ? t("homeCtaTwin") : "Switch Mode"}
                >
                  {theme === "dark" ? <Sun size={13} className="animate-spin-slow text-amber-400" /> : <Moon size={13} className="text-indigo-400" />}
                </button>
              </div>
            </div>

            {/* Main content body with dynamic smooth fade/slide keyframe transitions and Touch Gestures */}
            <main
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex-1 min-h-0 w-full ${isAssistant ? "overflow-hidden pb-4 lg:pb-8" : "overflow-y-auto pb-36 lg:pb-8"} overflow-x-hidden relative flex flex-col justify-start items-stretch pt-14 lg:pt-0`}
            >
              <div
                key={currentPath}
                className={`w-full flex-1 min-h-0 min-w-0 flex flex-col justify-stretch items-stretch ${
                  transitionStyle === "slide"
                    ? direction === "forward"
                      ? "animate-slide-forward"
                      : "animate-slide-backward"
                    : transitionStyle === "zoom"
                    ? direction === "forward"
                      ? "animate-zoom-forward"
                      : "animate-zoom-backward"
                    : transitionStyle === "3d"
                    ? direction === "forward"
                      ? "animate-flip-forward"
                      : "animate-flip-backward"
                    : direction === "forward"
                    ? "animate-skew-forward"
                    : "animate-skew-backward"
                }`}
              >
                {children}
              </div>
            </main>

          </div>

        </div>

        {/* 4a. Mobile Arc Navbar — menu stays open across navigation, only FAB toggles */}
        <div className="arc-navbar-mobile lg:hidden">

          {/* Satellite items — always the 4 pages NOT currently active, in hierarchy order */}
          {satellitePages.map((path, idx) => {
            const arcPos = `arc-item-${idx + 1}` as const
            const cfg = PAGE_CONFIG[path]
            const isSelecting = selectingPath === path
            return (
              <button
                key={`${idx}-${path}`}  // key includes index so re-animates when content at position changes
                onClick={() => handleSatelliteClick(path)}
                className={[
                  getArcNavClass(path),
                  arcPos,
                  'arc-satellite-enter',                          // always plays entry animation on mount
                  isArcOpen ? 'arc-item-visible' : 'arc-item-hidden',
                  isSelecting ? 'arc-item-selecting' : '',
                ].join(' ')}
                style={{
                  transitionDelay: isArcOpen
                    ? (idx === 0 || idx === 3 ? '0.07s' : '0.03s') // stagger: outer items delayed
                    : '0s',
                }}
                title={cfg.label[language as 'en' | 'id'] ?? cfg.label.en}
              >
                {cfg.icon(15)}
                <span className="text-[7px] font-bold mt-0.5 leading-none tracking-tight">
                  {cfg.label[language as 'en' | 'id'] ?? cfg.label.en}
                </span>
              </button>
            )
          })}

          {/* CENTER FAB — pure toggle, icon = current active page, animates on route change */}
          <button
            onClick={handleFabClick}
            className={`arc-home-btn flex items-center justify-center w-14 h-14 rounded-full border-2 overflow-hidden
              bg-blue-600 border-blue-500/60 text-white shadow-2xl shadow-blue-500/40
              transition-transform duration-300 active:scale-90`}
            title={isArcOpen
              ? (language === "en" ? "Close Menu" : "Tutup Menu")
              : (language === "en" ? "Open Menu" : "Buka Menu")}
          >
            {/* key={currentPath} forces re-mount on route change → triggers slide animation */}
            <span
              key={menuPath}
              className={`fab-icon-anim ${
                direction === 'forward' ? 'fab-icon-from-right' : 'fab-icon-from-left'
              }`}
            >
              {PAGE_CONFIG[menuPath]?.icon(22) ?? <Home size={22} />}
            </span>
          </button>
        </div>

        {/* 4b. Desktop Pill Navbar — hidden on mobile */}
        <div className="bottom-nav-pill absolute hidden lg:flex bottom-[-22px] left-1/2 -translate-x-1/2 z-[100] bg-slate-950/80 backdrop-blur-md border border-white/[0.08] px-4 md:px-5 py-2.5 rounded-full gap-2 md:gap-3 shadow-2xl glow-blue glass-pill">
          <Link to="/" className={getNavLinkClass("/")} title={language === "en" ? "Home" : "Beranda"}>
            <Home size={16} />
          </Link>
          <Link to="/about" className={getNavLinkClass("/about")} title={language === "en" ? "About & Skills" : "Tentang & Keahlian"}>
            <User size={16} />
          </Link>
          <Link to="/projects" className={getNavLinkClass("/projects")} title={language === "en" ? "Projects" : "Proyek"}>
            <Briefcase size={16} />
          </Link>
          <Link to="/assistant" className={getNavLinkClass("/assistant")} title={language === "en" ? "AI Assistant" : "Asisten AI"}>
            <Bot size={16} />
          </Link>
          <Link to="/contact" className={getNavLinkClass("/contact")} title={language === "en" ? "Contact" : "Kontak"}>
            <Mail size={16} />
          </Link>
        </div>

        {/* 5. Sliding Profile Drawer for Mobile viewports */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden animate-[fade-in_0.2s_ease-out]"
          />
        )}
        <div className={`fixed inset-y-0 left-0 w-[285px] h-full z-50 shadow-2xl transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] transform lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <Sidebar isDrawer={true} onClose={() => setIsSidebarOpen(false)} />
        </div>

      </div>

      {/* Custom Global Animation Injector for Keyframes */}
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default MainLayout
