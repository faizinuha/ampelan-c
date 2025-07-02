
import { Link, useLocation } from "react-router-dom"
import type React from "react"

interface NavLinkProps {
  to: string
  children: React.ReactNode
  className?: string
  mobile?: boolean
  onClick?: () => void
}

export const NavLink = ({ to, children, className = "", mobile = false, onClick }: NavLinkProps) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`${className} ${
        isActive
          ? mobile
            ? "bg-green-100 text-green-700 font-semibold"
            : "text-green-600 border-b-2 border-green-600"
          : mobile
            ? "text-gray-700 hover:bg-gray-100"
            : "text-gray-700 hover:text-green-600"
      } transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
