"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 max-lg:ml-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
