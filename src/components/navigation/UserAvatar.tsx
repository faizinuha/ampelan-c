
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
import { User, Settings, LogOut } from "lucide-react"
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

  return (
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
        <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
