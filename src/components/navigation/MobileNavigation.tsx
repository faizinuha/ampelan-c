
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, FileText, Bell } from "lucide-react"
import { NavLink } from "./NavLink"
import { UserAvatar } from "./UserAvatar"
import { navItems } from "./NavigationItems"
import NotificationCenter from "@/components/NotificationCenter"
import type { User, Profile } from "@/types/auth"

interface MobileNavigationProps {
  isAuthenticated: boolean
  user: User | null
  profile: Profile | null
  onLogout: () => void
}

export const MobileNavigation = ({ isAuthenticated, user, profile, onLogout }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center space-x-2">
      {isAuthenticated && user && (
        <>
          <NotificationCenter />
          <UserAvatar user={user} profile={profile} onLogout={onLogout} />
        </>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-green-50 border border-green-200 hover:border-green-300 transition-all duration-200">
            <Menu className="h-5 w-5 text-green-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-br from-green-50 to-amber-50">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center space-x-3 pb-6 border-b border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">DA</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Desa Ampelan</h1>
                <p className="text-sm text-green-600 font-medium">Portal Digital Desa</p>
              </div>
            </div>

            {/* User Info (if authenticated) */}
            {isAuthenticated && user && profile && (
              <div className="py-4 border-b border-green-200">
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {profile.full_name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">
                      {profile.full_name || "Pengguna"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex-1 py-6">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    mobile={true}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/70 hover:shadow-md border border-transparent hover:border-green-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{item.label}</span>
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ajukan Dokumen
                  </Button>
                )}
              </nav>
            </div>

            {/* Auth Actions */}
            {!isAuthenticated && (
              <div className="border-t border-green-200 pt-6 space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
