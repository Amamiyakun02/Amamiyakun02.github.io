// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Projects from "../pages/Projects"
import Assistant from "../pages/Assistant"
import Contact from "../pages/Contact"
import Feedback from "../pages/Feedback"
import PdfAnalysis from "../pages/PdfAnalysis"
import RemoveBg from "../pages/RemoveBg"
import ImageToPdf from "../pages/ImageToPdf"
import MainLayout from "../layouts/MainLayout"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/assistant" element={<MainLayout><Assistant /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/feedback" element={<MainLayout><Feedback /></MainLayout>} />
      <Route path="/pdf-analysis" element={<MainLayout><PdfAnalysis /></MainLayout>} />
      <Route path="/remove-bg" element={<MainLayout><RemoveBg /></MainLayout>} />
      <Route path="/image-to-pdf" element={<MainLayout><ImageToPdf /></MainLayout>} />
    </Routes>
  )
}

export default AppRoutes

