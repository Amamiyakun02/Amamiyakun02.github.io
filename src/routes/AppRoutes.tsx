// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Assistant from "../pages/Assistant"
import Other from "../pages/Other"
import MainLayout from "../layouts/MainLayout"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/assistant" element={<MainLayout><Assistant /></MainLayout>} />
      <Route path="/other" element={<MainLayout><Other /></MainLayout>} />
    </Routes>
  )
}

export default AppRoutes
