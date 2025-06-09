"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import type { Message } from "@/types/customerService"

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { profile } = useAuth()

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isUser = message.sender_type === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 sm:mb-4`}>
      <div
        className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
          {isUser ? (
            <>
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-green-600 text-white text-xs">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            </AvatarFallback>
          )}
        </Avatar>

        <div
          className={`rounded-lg p-2 sm:p-3 ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white text-gray-800 shadow-md border border-gray-100 rounded-bl-sm"
          }`}
        >
          <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{message.message}</div>
          <div
            className={`text-xs mt-1 ${isUser ? "text-blue-100" : "text-gray-500"} ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  )
}
