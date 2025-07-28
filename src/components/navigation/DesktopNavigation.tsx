
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavLink } from "./NavLink"
import { UserAvatar } from "./UserAvatar"
import { navItems } from "./NavigationItems"
import NotificationCenter from "@/components/NotificationCenter"
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
        {isAuthenticated && user && (
          <>
            <NotificationCenter />
            <UserAvatar user={user} profile={profile} onLogout={onLogout} />
          </>
        )}
        {!isAuthenticated && (
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
    </>
  )
}
