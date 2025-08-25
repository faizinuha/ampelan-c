
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DesktopNavigation } from "./navigation/DesktopNavigation"
import { MobileNavigation } from "./navigation/MobileNavigation"
import { LogoutDialog } from "./navigation/LogoutDialog"
import { Loader2 } from "lucide-react"

const Navigation = () => {
  const { user, profile, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debug logging untuk troubleshooting
  useEffect(() => {
    console.log("📊 Navigation state:", {
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      profile: profile ? { id: profile.id, full_name: profile.full_name, role: profile.role } : null,
      isLoading,
    })
  }, [user, profile, isLoading])

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate("/", { replace: true })
    } catch (error) {
      console.error("❌ Logout error:", error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  // Cek apakah user sudah login dan profile sudah dimuat
  const isAuthenticated = Boolean(user && !isLoading)
  
  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Desa Ampelan</h1>
              </div>
            </Link>

            {/* Loading indicator */}
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <span className="text-sm text-gray-600">Memuat...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Desa Ampelan</h1>
              </div>
            </Link>

            <DesktopNavigation
              isAuthenticated={isAuthenticated}
              user={user}
              profile={profile}
              onLogout={handleLogout}
            />

            <MobileNavigation
              isAuthenticated={isAuthenticated}
              user={user}
              profile={profile}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </nav>

      <LogoutDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={confirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  )
}

export default Navigation
