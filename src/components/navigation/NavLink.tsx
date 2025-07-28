
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  to: string
  children: React.ReactNode
  className?: string
  mobile?: boolean
  onClick?: () => void
}

export const NavLink = ({ to, children, className, mobile = false, onClick }: NavLinkProps) => {
  const location = useLocation()
  const isActive = location.pathname === to

  const baseClasses = mobile
    ? "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
    : "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"

  const activeClasses = mobile
    ? "bg-white/80 text-green-700 shadow-md border border-green-200 font-semibold"
    : "bg-green-100 text-green-800 shadow-sm border border-green-200 font-semibold"

  const inactiveClasses = mobile
    ? "text-gray-700 hover:bg-white/50 hover:text-green-700 hover:shadow-sm border border-transparent hover:border-green-200"
    : "text-gray-700 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200"

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        baseClasses,
        isActive ? activeClasses : inactiveClasses,
        className
      )}
    >
      {children}
    </Link>
  )
}
