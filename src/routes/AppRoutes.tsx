// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Projects from "../pages/Projects"
import Assistant from "../pages/Assistant"
import Contact from "../pages/Contact"
import PdfAnalysis from "../pages/PdfAnalysis"
import MainLayout from "../layouts/MainLayout"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/assistant" element={<MainLayout><Assistant /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/pdf-analysis" element={<MainLayout><PdfAnalysis /></MainLayout>} />
    </Routes>
  )
}

export default AppRoutes

