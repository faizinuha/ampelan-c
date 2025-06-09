"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import type { ChatInputProps } from "@/types/customerService"

export const ChatInput = ({
  inputMessage,
  setInputMessage,
  isTyping,
  isLoading = false,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) => {
  return (
    <div className="border-t bg-gray-50/50 p-3 sm:p-4">
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ketik pertanyaan Anda..."
          className="flex-1 text-sm sm:text-base"
          disabled={isTyping || isLoading}
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isTyping || isLoading}
          className="bg-green-600 hover:bg-green-700 px-3 sm:px-4"
          size="sm"
        >
          {isTyping || isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2 px-1">Tekan Enter untuk mengirim pesan</p>
    </div>
  )
}
