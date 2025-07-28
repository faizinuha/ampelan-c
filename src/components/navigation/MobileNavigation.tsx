
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, FileText } from "lucide-react"
import { NavLink } from "./NavLink"
import { UserAvatar } from "./UserAvatar"
import { navItems } from "./NavigationItems"
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
        <UserAvatar user={user} profile={profile} onLogout={onLogout} />
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
                    onClick={() => setIsOpen(false)}
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
  )
}
