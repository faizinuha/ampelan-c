
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Message, DatabaseMessage } from '@/types/customerService';

export const useCustomerServiceChat = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadChatHistory();
      sendWelcomeMessageIfNeeded();
    } else {
      showGuestWelcomeMessage();
    }
  }, [user, profile]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customer_service_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        toast({
          title: "Error",
          description: "Gagal memuat riwayat chat",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const typedMessages: Message[] = data.map((dbMessage: DatabaseMessage) => ({
          id: dbMessage.id,
          message: dbMessage.message,
          sender_type: dbMessage.sender_type as 'user' | 'agent' | 'bot',
          created_at: dbMessage.created_at,
          user_id: dbMessage.user_id
        }));
        setMessages(typedMessages);
      }
    } catch (error) {
      console.error('Error in loadChatHistory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeMessageIfNeeded = async () => {
    if (!user) return;

    const { data: existingMessages } = await supabase
      .from('customer_service_chats')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (!existingMessages || existingMessages.length === 0) {
      await sendBotMessage(`Selamat datang di Customer Service Desa Ampelan! 👋\n\n${user ? `Halo, ${profile?.full_name || user.name}!` : 'Halo!'} Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`);
    }
  };

  const showGuestWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: '1',
      message: `Selamat datang di Customer Service Desa Ampelan! 👋\n\nHalo! Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`,
      sender_type: 'bot',
      created_at: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    setIsLoading(false);
  };

  const sendBotMessage = async (message: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customer_service_chats')
        .insert([
          {
            user_id: user.id,
            message: message,
            sender_type: 'bot'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error sending bot message:', error);
        return;
      }

      if (data) {
        const typedMessage: Message = {
          id: data.id,
          message: data.message,
          sender_type: data.sender_type as 'user' | 'agent' | 'bot',
          created_at: data.created_at,
          user_id: data.user_id
        };
        setMessages(prev => [...prev, typedMessage]);
      }
    } catch (error) {
      console.error('Error in sendBotMessage:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!user) {
      toast({
        title: "Info",
        description: "Silakan login terlebih dahulu untuk menggunakan chat",
        variant: "default",
      });
      return;
    }

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const { data: userMessage, error: userError } = await supabase
        .from('customer_service_chats')
        .insert([
          {
            user_id: user.id,
            message: messageText,
            sender_type: 'user'
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('Error saving user message:', userError);
        toast({
          title: "Error",
          description: "Gagal mengirim pesan",
          variant: "destructive",
        });
        return;
      }

      if (userMessage) {
        const typedUserMessage: Message = {
          id: userMessage.id,
          message: userMessage.message,
          sender_type: userMessage.sender_type as 'user' | 'agent' | 'bot',
          created_at: userMessage.created_at,
          user_id: userMessage.user_id
        };
        setMessages(prev => [...prev, typedUserMessage]);
      }

      setIsTyping(true);

      setTimeout(async () => {
        const botResponse = 'Terima kasih atas pertanyaan Anda. Tim customer service kami akan segera membantu Anda. Untuk informasi lebih detail, silakan hubungi kantor desa di (0271) 123456.';
        
        const { data: botMessage, error: botError } = await supabase
          .from('customer_service_chats')
          .insert([
            {
              user_id: user.id,
              message: botResponse,
              sender_type: 'bot'
            }
          ])
          .select()
          .single();

        if (botError) {
          console.error('Error saving bot message:', botError);
        } else if (botMessage) {
          const typedBotMessage: Message = {
            id: botMessage.id,
            message: botMessage.message,
            sender_type: botMessage.sender_type as 'user' | 'agent' | 'bot',
            created_at: botMessage.created_at,
            user_id: botMessage.user_id
          };
          setMessages(prev => [...prev, typedBotMessage]);
        }

        setIsTyping(false);
      }, 2000);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim pesan",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    isLoading,
    handleSendMessage,
    handleKeyPress
  };
};
