"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
     const token = localStorage.getItem("token");
     const user_data = JSON.parse(localStorage.getItem("user"));
 
     if (token || user_data?.isAdmin) {
       router.push("http://localhost:3000/pages/banker/accountpage");
     } 
   }, []);
  
  const validateForm = () => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("https://banking-backend-s2cq.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password , role:"banker" }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Login failed")

      // Store token & user info in LocalStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

    router.push("http://localhost:3000/pages/banker/accountpage")
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Banker's Login</h1>
          <p className="text-gray-500 mb-6">Login to access your account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0f172a] text-white rounded-md text-sm font-medium transition-colors hover:bg-[#1e293b] disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : `Login`}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
