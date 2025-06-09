import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-3 sm:mb-4">
      <div className="flex items-start space-x-2">
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
          <AvatarFallback className="bg-green-600 text-white text-xs">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="bg-white border rounded-lg rounded-bl-sm p-3 shadow-md">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
