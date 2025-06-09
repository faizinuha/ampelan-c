"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import type { Message, DatabaseMessage } from "@/types/customerService"

export const useCustomerServiceChat = () => {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadChatHistory()
      sendWelcomeMessageIfNeeded()
    } else {
      showGuestWelcomeMessage()
    }
  }, [user, profile])

  const loadChatHistory = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("customer_service_chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error loading chat history:", error)
        toast({
          title: "Error",
          description: "Gagal memuat riwayat chat",
          variant: "destructive",
        })
        return
      }

      if (data) {
        const typedMessages: Message[] = data.map((dbMessage: DatabaseMessage) => ({
          id: dbMessage.id,
          message: dbMessage.message,
          sender_type: dbMessage.sender_type as "user" | "agent" | "bot",
          created_at: dbMessage.created_at,
          user_id: dbMessage.user_id,
        }))
        setMessages(typedMessages)
      }
    } catch (error) {
      console.error("Error in loadChatHistory:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendWelcomeMessageIfNeeded = async () => {
    if (!user) return

    const { data: existingMessages } = await supabase
      .from("customer_service_chats")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)

    if (!existingMessages || existingMessages.length === 0) {
      await sendBotMessage(
        `Selamat datang di Customer Service Desa Ampelan! 👋\n\n${
          user ? `Halo, ${profile?.full_name || user.name}!` : "Halo!"
        } Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`,
      )
    }
  }

  const showGuestWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: "1",
      message: `Selamat datang di Customer Service Desa Ampelan! 👋\n\nHalo! Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`,
      sender_type: "bot",
      created_at: new Date().toISOString(),
    }
    setMessages([welcomeMessage])
    setIsLoading(false)
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("jam") || lowerMessage.includes("operasional")) {
      return "🕐 **Jam Operasional Kantor Desa Ampelan:**\n\n📅 Senin - Jumat: 08.00 - 16.00 WIB\n📅 Sabtu: 08.00 - 12.00 WIB\n📅 Minggu & Libur Nasional: TUTUP\n\n📍 Lokasi: Jl. Desa Ampelan No. 1\n📞 Telepon: (0274) 123-456"
    }

    if (lowerMessage.includes("surat") || lowerMessage.includes("keterangan")) {
      return "📄 **Syarat Surat Keterangan:**\n\n✅ KTP asli + fotokopi\n✅ KK asli + fotokopi\n✅ Pas foto 3x4 (2 lembar)\n✅ Formulir permohonan\n\n💰 Biaya: Rp 5.000\n⏱️ Proses: 1-2 hari kerja\n\n📝 Datang langsung ke kantor desa dengan membawa persyaratan lengkap."
    }

    if (lowerMessage.includes("bantuan") || lowerMessage.includes("sosial")) {
      return "🤝 **Program Bantuan Sosial:**\n\n1️⃣ Bantuan Langsung Tunai (BLT)\n2️⃣ Program Keluarga Harapan (PKH)\n3️⃣ Bantuan Pangan Non Tunai (BPNT)\n4️⃣ Bantuan Lansia & Disabilitas\n\n📋 Syarat: KTP + KK + Surat Keterangan Tidak Mampu\n📍 Info lengkap di kantor desa"
    }

    if (lowerMessage.includes("domisili")) {
      return "🏠 **Syarat Surat Domisili:**\n\n✅ KTP asli + fotokopi\n✅ KK asli + fotokopi\n✅ Surat pengantar RT/RW\n✅ Pas foto 3x4 (2 lembar)\n✅ Formulir permohonan\n\n💰 Biaya: Rp 3.000\n⏱️ Proses: 1 hari kerja"
    }

    if (lowerMessage.includes("kepala desa") || lowerMessage.includes("kontak")) {
      return "📞 **Kontak Penting Desa Ampelan:**\n\n👨‍💼 Kepala Desa: +62 812-3456-7890\n📝 Sekretaris Desa: +62 813-4567-8901\n🏢 Kantor Desa: (0274) 123-456\n📧 Email: info@ampelan.desa.id\n📍 Alamat: Jl. Desa Ampelan No. 1, Kec. Ampelan"
    }

    if (lowerMessage.includes("kegiatan") || lowerMessage.includes("agenda")) {
      return "📅 **Kegiatan Desa Bulan Ini:**\n\n🏃‍♀️ Setiap Minggu: Senam sehat (06.00)\n📋 Tanggal 15: Rapat RT/RW\n🧹 Tanggal 20: Gotong royong\n👶 Tanggal 25: Posyandu balita\n📊 Tanggal 30: Evaluasi bulanan\n\n📌 Info lengkap di papan pengumuman kantor desa"
    }

    if (lowerMessage.includes("halo") || lowerMessage.includes("hai") || lowerMessage.includes("selamat")) {
      return "👋 Halo! Selamat datang di layanan Customer Service Desa Ampelan.\n\nSaya siap membantu Anda dengan berbagai informasi dan layanan desa. Ada yang bisa saya bantu hari ini? 😊"
    }

    if (lowerMessage.includes("terima kasih") || lowerMessage.includes("thanks")) {
      return "🙏 Sama-sama! Senang bisa membantu Anda.\n\nJika ada pertanyaan lain, jangan ragu untuk bertanya. Semoga hari Anda menyenangkan! 😊✨"
    }

    return "📝 **Informasi Lebih Lanjut:**\n\nUntuk informasi detail, Anda bisa:\n\n🏢 Datang ke kantor desa (Senin-Jumat 08.00-16.00)\n📞 Telepon: (0274) 123-456\n📧 Email: info@ampelan.desa.id\n\nAda yang bisa saya bantu lagi? 😊"
  }

  const sendBotMessage = async (message: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("customer_service_chats")
        .insert([
          {
            user_id: user.id,
            message: message,
            sender_type: "bot",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error sending bot message:", error)
        return
      }

      if (data) {
        const typedMessage: Message = {
          id: data.id,
          message: data.message,
          sender_type: data.sender_type as "user" | "agent" | "bot",
          created_at: data.created_at,
          user_id: data.user_id,
        }
        setMessages((prev) => [...prev, typedMessage])
      }
    } catch (error) {
      console.error("Error in sendBotMessage:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    if (!user) {
      toast({
        title: "Info",
        description: "Silakan login terlebih dahulu untuk menggunakan chat",
        variant: "default",
      })
      return
    }

    const messageText = inputMessage.trim()
    setInputMessage("")

    try {
      const { data: userMessage, error: userError } = await supabase
        .from("customer_service_chats")
        .insert([
          {
            user_id: user.id,
            message: messageText,
            sender_type: "user",
          },
        ])
        .select()
        .single()

      if (userError) {
        console.error("Error saving user message:", userError)
        toast({
          title: "Error",
          description: "Gagal mengirim pesan",
          variant: "destructive",
        })
        return
      }

      if (userMessage) {
        const typedUserMessage: Message = {
          id: userMessage.id,
          message: userMessage.message,
          sender_type: userMessage.sender_type as "user" | "agent" | "bot",
          created_at: userMessage.created_at,
          user_id: userMessage.user_id,
        }
        setMessages((prev) => [...prev, typedUserMessage])
      }

      setIsTyping(true)

      setTimeout(
        async () => {
          const botResponse = generateBotResponse(messageText)

          const { data: botMessage, error: botError } = await supabase
            .from("customer_service_chats")
            .insert([
              {
                user_id: user.id,
                message: botResponse,
                sender_type: "bot",
              },
            ])
            .select()
            .single()

          if (botError) {
            console.error("Error saving bot message:", botError)
          } else if (botMessage) {
            const typedBotMessage: Message = {
              id: botMessage.id,
              message: botMessage.message,
              sender_type: botMessage.sender_type as "user" | "agent" | "bot",
              created_at: botMessage.created_at,
              user_id: botMessage.user_id,
            }
            setMessages((prev) => [...prev, typedBotMessage])
          }

          setIsTyping(false)
        },
        1500 + Math.random() * 1000,
      )
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim pesan",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    isLoading,
    handleSendMessage,
    handleKeyPress,
  }
}
