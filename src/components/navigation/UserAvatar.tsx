
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
import { Link } from "react-router-dom"
import { User, Settings, LogOut, MapPin, Phone, Briefcase } from "lucide-react"
import type { User as UserType, Profile } from "@/types/auth"

interface UserAvatarProps {
  user: UserType
  profile: Profile | null
  onLogout: () => void
}

export const UserAvatar = ({ user, profile, onLogout }: UserAvatarProps) => {
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleDisplay = (role: string) => {
    return role === "admin" ? "Administrator" : "Warga Desa"
  }

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "default" : "secondary"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-green-50 border-2 border-transparent hover:border-green-200 transition-all duration-200">
          <Avatar className="h-10 w-10 ring-2 ring-green-100">
            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Avatar"} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-700 text-white font-semibold">
              {getInitials(profile?.full_name || user?.name || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border border-green-200 shadow-xl" align="end">
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-amber-50 border-b border-green-100">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-green-200">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Avatar"} />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-700 text-white font-semibold text-sm">
                {getInitials(profile?.full_name || user?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {profile?.full_name || user?.name || "Pengguna"}
              </p>
              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
              <Badge 
                variant={getRoleBadgeVariant(user?.role || "user")} 
                className="mt-1 text-xs bg-green-100 text-green-800 border-green-200"
              >
                {getRoleDisplay(user?.role || "user")}
              </Badge>
            </div>
          </div>
        </div>

        {/* User Details */}
        {profile && (
          <div className="p-3 space-y-2 border-b border-green-100">
            {profile.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-green-600" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="truncate">{profile.address}</span>
              </div>
            )}
            {profile.rt_rw && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="h-4 w-4 bg-green-100 rounded-sm flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-xs">RT</span>
                </div>
                <span>{profile.rt_rw}</span>
              </div>
            )}
            {profile.occupation && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4 text-green-600" />
                <span>{profile.occupation}</span>
              </div>
            )}
          </div>
        )}

        {/* Menu Items */}
        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-green-50 transition-colors">
              <User className="mr-3 h-4 w-4 text-green-600" />
              <span className="text-gray-700">Profil Saya</span>
            </Link>
          </DropdownMenuItem>
          {user?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center px-3 py-2 rounded-md hover:bg-green-50 transition-colors">
                <Settings className="mr-3 h-4 w-4 text-green-600" />
                <span className="text-gray-700">Panel Admin</span>
              </Link>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="bg-green-100" />
        
        <div className="p-2">
          <DropdownMenuItem 
            onClick={onLogout} 
            className="flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
