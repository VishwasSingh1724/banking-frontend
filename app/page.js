"use client"
import { useEffect, useState } from "react"
import DashboardPage from "./components/Dashboard"
import LoginPage from "./pages/login/page"


export default function Home() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"))
    }
  }, [])

  if (!token) {
    return <LoginPage />
  }

  return <DashboardPage />
}
