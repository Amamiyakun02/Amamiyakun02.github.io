import { Link } from "react-router-dom"
import { Home as HomeIcon, User, Briefcase, Bot, Mail, Phone, Instagram, Facebook, Github, Linkedin, MessageSquare } from "lucide-react"
import avatar from "../assets/images/profile.jpg"
import AssistantButton from "../components/AssistantButton"

const Home = () => {
  return (
    <div className="min-h-screen bg-[#d5eafd] flex flex-col items-center justify-center px-4 relative overflow-x-hidden isolate">

      {/* Kontainer utama */}
        <div className="relative flex w-full max-w-screen-2xl bg-slate-50 rounded-[25px] overflow-visible min-h-[800px] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {/* Tombol Panah Kiri */}
            <button className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-blue-100 transition z-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            </button>

            {/* Tombol Panah Kanan */}
            <button className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-blue-100 transition z-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            </button>

        {/* Sidebar */}
        <div className="w-[300px] bg-slate-800 rounded-[25px] p-6 flex flex-col items-center">
          <img
            src={avatar}
            alt="Profile"
            className="w-[200px] h-[200px] object-cover rounded-full mt-4"
          />
          <h2 className="text-white text-xl font-extrabold mt-4">
            Amamiya (Maireza)
          </h2>
          <p className="text-white text-sm font-medium mt-1">A.I Engineer</p>

          {/* Social Icons */}
          <div className="mt-8 flex gap-3">
            <a href="https://wa.me/6283863450720" target="_blank" rel="noreferrer">
              <MessageSquare size={18} className="text-white hover:text-green-400" />
            </a>
            <a href="https://instagram.com/yourusername" target="_blank" rel="noreferrer">
              <Instagram size={18} className="text-white hover:text-pink-400" />
            </a>
            <a href="https://facebook.com/yourusername" target="_blank" rel="noreferrer">
              <Facebook size={18} className="text-white hover:text-blue-400" />
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer">
              <Github size={18} className="text-white hover:text-gray-300" />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer">
              <Linkedin size={18} className="text-white hover:text-blue-300" />
            </a>
          </div>

          {/* Kontak */}
            <p className="text-white text-xs text-center mt-4 px-2">
            <Phone size={14} className="inline mr-2" />
            +6283863450720 or talk directly to my{" "}
            <a
                href="https://amamiyakun02.github.io/PersonalAssistant"
                className="italic underline hover:text-blue-300 transition"
            >
                AI Assistant
            </a>.
            </p>
        </div>

        {/* Konten Tengah */}
        <div className="flex-1 p-10 md:p-14 relative flex flex-col justify-center items-center">
          <div className="text-[48px] md:text-[60px] text-slate-900 font-normal underline text-center">
            Hello!, I’m Amamiya
          </div>
          <p className="text-base md:text-xl text-slate-800 mt-4 text-center">
            A.I Engineer | Software Developer | Linux Enthusiast | Toolsmith
          </p>

          <div className="mt-12 space-y-6 text-center max-w-2xl">
            <p className="text-sm md:text-lg text-slate-700 leading-relaxed">
              A developer passionate about creating smart tools and practical AI systems. <br />
              I focus on building real-world solutions that actually help people.
            </p>
            <p className="text-base md:text-xl text-slate-600 font-bold">
              "Build once, useful forever — clever little solutions for big problems."
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button className="bg-blue-500 text-white text-sm md:text-lg font-semibold px-6 py-3 rounded-[15px]">
              See Project
            </button>
            <span className="w-[2px] h-[40px] bg-gray-300 hidden md:block" />
            <button className="bg-blue-500 text-white text-sm md:text-lg font-semibold px-6 py-3 rounded-[15px]">
              Download CV
            </button>
          </div>
        </div>

        {/* Tombol Assistant di pojok kanan bawah kontainer */}
        <AssistantButton />
      </div>

{/* Tombol Navigasi (di luar konten, menempel layar bawah) */}
      <div className="absolute bottom-20 left-[56%] transform -translate-x-1/2 flex gap-4 bg-white shadow-md rounded-[20px] px-6 py-3">
        <Link to="/" className="hover:bg-blue-100 p-2 rounded-full transition">
          <HomeIcon size={20} className="text-slate-700" />
        </Link>
        <Link to="/about" className="hover:bg-blue-100 p-2 rounded-full transition">
          <User size={20} className="text-slate-700" />
        </Link>
        <Link to="/projects" className="hover:bg-blue-100 p-2 rounded-full transition">
          <Briefcase size={20} className="text-slate-700" />
        </Link>
        <Link to="/assistant" className="hover:bg-blue-100 p-2 rounded-full transition">
          <Bot size={20} className="text-slate-700" />
        </Link>
        <Link to="/contact" className="hover:bg-blue-100 p-2 rounded-full transition">
          <Mail size={20} className="text-slate-700" />
        </Link>
      </div>
    </div>
  )
}

export default Home
