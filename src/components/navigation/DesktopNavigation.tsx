
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavLink } from "./NavLink"
import { UserAvatar } from "./UserAvatar"
import { navItems } from "./NavigationItems"
import NotificationCenter from "@/components/NotificationCenter"
import { Bell } from "lucide-react"
import type { User, Profile } from "@/types/auth"

interface DesktopNavigationProps {
  isAuthenticated: boolean
  user: User | null
  profile: Profile | null
  onLogout: () => void
}

export const DesktopNavigation = ({ isAuthenticated, user, profile, onLogout }: DesktopNavigationProps) => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-3">
        {isAuthenticated && user && (
          <>
            <div className="relative">
              <NotificationCenter />
            </div>
            <div className="h-8 w-px bg-green-200 mx-2"></div>
            <UserAvatar user={user} profile={profile} onLogout={onLogout} />
          </>
        )}
        {!isAuthenticated && (
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:bg-green-50 hover:text-green-800 border border-green-200 hover:border-green-300 transition-all duration-200"
              >
                Masuk
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                Daftar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
