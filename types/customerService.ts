import type React from "react"
export interface Message {
  id: string
  message: string
  sender_type: "user" | "agent" | "bot"
  created_at: string
  user_id?: string
}

export interface DatabaseMessage {
  id: string
  message: string
  sender_type: string
  created_at: string
  user_id: string
}

export interface ChatInputProps {
  inputMessage: string
  setInputMessage: (value: string) => void
  isTyping: boolean
  isLoading?: boolean
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}
