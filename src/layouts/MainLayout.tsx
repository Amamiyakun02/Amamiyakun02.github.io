// src/layouts/MainLayout.tsx
import { type ReactNode } from "react"
import Sidebar from "../components/Sidebar"

type Props = {
  children: ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-black text-gray-800 dark:text-white">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}

export default MainLayout
