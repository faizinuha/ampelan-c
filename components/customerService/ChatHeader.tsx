import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Users, Clock } from "lucide-react"

export const ChatHeader = () => {
  return (
    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg p-3 sm:p-4">
      <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-semibold">CS Desa Ampelan</span>
            <div className="flex items-center space-x-1 text-xs text-green-100">
              <Users className="w-3 h-3" />
              <span>Asisten Virtual</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-500 text-white text-xs px-2 py-1">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            Online
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs px-2 py-1">
            <Clock className="w-3 h-3 mr-1" />
            24/7
          </Badge>
        </div>
      </CardTitle>
    </CardHeader>
  )
}
