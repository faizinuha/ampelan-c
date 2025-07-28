
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { DesktopNavigation } from "./navigation/DesktopNavigation"
import { MobileNavigation } from "./navigation/MobileNavigation"
import { LogoutDialog } from "./navigation/LogoutDialog"

const Navigation = () => {
  const { user, profile, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debug logging for troubleshooting - reduced frequency
  useEffect(() => {
    if (!isLoading) {
      console.log("Navigation state updated:", {
        user: user ? { id: user.id, email: user.email, role: user.role } : null,
        profile: profile ? { id: profile.id, full_name: profile.full_name, role: profile.role } : null,
      })
    }
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
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  // Check if user is authenticated and profile is loaded
  const isAuthenticated = Boolean(user && profile && !isLoading)

  return (
    <>
      <nav className="bg-gradient-to-r from-green-50 to-amber-50 shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-lg">DA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-200">
                  Desa Ampelan
                </h1>
                <p className="text-xs text-green-600 font-medium -mt-1">Portal Digital Desa</p>
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
