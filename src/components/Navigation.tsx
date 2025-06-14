"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/AuthContext"
import { BookOpen, FileText, Home, LogOut, Menu, Settings, User, Calendar, MessageCircle } from "lucide-react"
import NotificationCenter from "./NotificationCenter"

const Navigation = () => {
  const { user, profile, logout, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debug logging untuk troubleshooting
  useEffect(() => {
    console.log("Navigation state:", {
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
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isActive = (path: string) => location.pathname === path

  // Navigation items
  const navItems = [
    { path: "/", label: "Beranda", icon: Home },
    { path: "/news", label: "Berita", icon: BookOpen },
    { path: "/activities", label: "Kegiatan", icon: Calendar },
    { path: "/customer-service", label: "Customer Service", icon: MessageCircle },
  ]

  const NavLink = ({
    to,
    children,
    className = "",
    mobile = false,
  }: {
    to: string
    children: React.ReactNode
    className?: string
    mobile?: boolean
  }) => (
    <Link
      to={to}
      className={`${className} ${
        isActive(to)
          ? mobile
            ? "bg-green-100 text-green-700 font-semibold"
            : "text-green-600 border-b-2 border-green-600"
          : mobile
            ? "text-gray-700 hover:bg-gray-100"
            : "text-gray-700 hover:text-green-600"
      } transition-colors duration-200`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  )

  // Cek apakah user sudah login dan profile sudah dimuat
  const isAuthenticated = Boolean(user && profile)

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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <NotificationCenter />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {getInitials(profile?.full_name || user?.name || "")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{profile?.full_name || user?.name || "Pengguna"}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                          <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="w-fit">
                            {user?.role === "admin" ? "Admin" : "Warga"}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profil
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Panel Admin
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-green-600 text-white text-sm">
                          {getInitials(profile?.full_name || user?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{profile?.full_name || user?.name || "Pengguna"}</p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email}</p>
                        <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="w-fit text-xs">
                          {user?.role === "admin" ? "Admin" : "Warga"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-3 pb-6 border-b">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">DA</span>
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-gray-900">Desa Ampelan</h1>
                        <p className="text-xs text-gray-600">Portal Digital</p>
                      </div>
                    </div>

                    <div className="flex-1 py-6">
                      <nav className="space-y-2">
                        {navItems.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            mobile={true}
                            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </NavLink>
                        ))}
                        {isAuthenticated && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4 text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => setIsOpen(false)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Ajukan Dokumen
                          </Button>
                        )}
                      </nav>
                    </div>

                    {!isAuthenticated && (
                      <div className="border-t pt-6 space-y-2">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Masuk
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-green-600 hover:bg-green-700">Daftar</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin keluar dari akun Anda?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} disabled={isLoggingOut} className="bg-red-600 hover:bg-red-700">
              {isLoggingOut ? (
                <>
                  <span className="mr-2">⏳</span>
                  Keluar...
                </>
              ) : (
                "Ya, Keluar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Navigation
