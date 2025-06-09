"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Bot, Phone, Mail, Clock, MessageCircle, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useCustomerServiceChat } from "@/hooks/useCustomerServiceChat"
import { ChatHeader } from "@/components/customerService/ChatHeader"
import { ChatMessage } from "@/components/customerService/ChatMessage"
import { ChatInput } from "@/components/customerService/ChatInput"
import { TypingIndicator } from "@/components/customerService/TypingIndicator"

const CustomerServiceChat = () => {
  const { user, profile } = useAuth()
  const { messages, inputMessage, setInputMessage, isTyping, isLoading, handleSendMessage, handleKeyPress } =
    useCustomerServiceChat()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const quickReplies = [
    "Jam operasional kantor desa",
    "Cara mengurus surat keterangan",
    "Informasi bantuan sosial",
    "Prosedur pengurusan domisili",
    "Kontak kepala desa",
    "Agenda kegiatan desa",
  ]

  const quickActions = [
    {
      title: "Surat Keterangan",
      icon: "📄",
      message: "Bagaimana cara mengurus surat keterangan?",
      color: "blue",
    },
    {
      title: "Bantuan Sosial",
      icon: "🤝",
      message: "Informasi bantuan sosial terbaru",
      color: "green",
    },
    {
      title: "Kegiatan Desa",
      icon: "📅",
      message: "Jadwal kegiatan desa bulan ini",
      color: "purple",
    },
    {
      title: "Kontak",
      icon: "📞",
      message: "Kontak penting desa",
      color: "orange",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-12 h-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Memuat chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Kembali</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Customer Service</h1>
                <p className="text-xs sm:text-sm text-gray-600">Desa Ampelan</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                <span className="hidden sm:inline">Online 24/7</span>
                <span className="sm:hidden">Online</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Info - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Asisten Virtual</h3>
                  <p className="text-sm text-gray-600">Siap membantu 24/7</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Respon cepat</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>(0274) 123-456</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>cs@ampelan.id</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Jl. Desa Ampelan No. 1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Pertanyaan Populer
                </h4>
                <div className="space-y-2">
                  {quickReplies.slice(0, 4).map((reply, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto py-2 text-gray-600 hover:text-green-600 hover:bg-green-50"
                      onClick={() => setInputMessage(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-span-1 lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl h-[calc(100vh-200px)] sm:h-[70vh] flex flex-col">
              <ChatHeader />

              <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollAreaRef}>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="text-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          Selamat datang di Customer Service Desa Ampelan!
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                          Saya siap membantu Anda dengan pertanyaan seputar layanan desa, prosedur administrasi, dan
                          informasi lainnya.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto px-4">
                          {quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-left justify-start text-green-600 border-green-200 hover:bg-green-50 text-xs sm:text-sm h-auto py-2"
                              onClick={() => setInputMessage(reply)}
                            >
                              {reply}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && <TypingIndicator />}
                  </div>
                </ScrollArea>

                <ChatInput
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  isTyping={isTyping}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  onKeyPress={handleKeyPress}
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`text-${action.color}-600 border-${action.color}-200 hover:bg-${action.color}-50 text-xs sm:text-sm h-auto py-2 px-2 sm:px-3`}
                  onClick={() => setInputMessage(action.message)}
                >
                  <span className="mr-1 sm:mr-2">{action.icon}</span>
                  <span className="truncate">{action.title}</span>
                </Button>
              ))}
            </div>

            {/* Mobile Info Panel */}
            <div className="lg:hidden mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Kontak Darurat
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>📞 (0274) 123-456</p>
                    <p>📧 cs@ampelan.id</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Jam Operasional
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Senin-Jumat: 08.00-16.00</p>
                    <p>Sabtu: 08.00-12.00</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerServiceChat
