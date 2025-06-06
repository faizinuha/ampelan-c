
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  message: string;
  sender_type: 'user' | 'agent' | 'bot';
  created_at: string;
  user_id?: string;
}

const CustomerServiceChat = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadChatHistory();
      
      // Send welcome message if no chat history
      const sendWelcomeMessage = async () => {
        const { data: existingMessages } = await supabase
          .from('customer_service_chats')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (!existingMessages || existingMessages.length === 0) {
          await sendBotMessage(`Selamat datang di Customer Service Desa Ampelan! 👋\n\n${user ? `Halo, ${profile?.full_name || user.name}!` : 'Halo!'} Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`);
        }
      };

      sendWelcomeMessage();
    } else {
      // For non-logged in users, show welcome message
      const welcomeMessage: Message = {
        id: '1',
        message: `Selamat datang di Customer Service Desa Ampelan! 👋\n\nHalo! Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`,
        sender_type: 'bot',
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      setIsLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        setMessages(data);
      }
    } catch (error) {
      console.error('Error in loadChatHistory:', error);
    } finally {
      setIsLoading(false);
    }
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
        setMessages(prev => [...prev, data]);
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
      // Save user message to database
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
        setMessages(prev => [...prev, userMessage]);
      }

      setIsTyping(true);

      // Simulate bot response after 2 seconds
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
          setMessages(prev => [...prev, botMessage]);
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Service</h1>
          <p className="text-gray-600">Chat dengan asisten virtual Desa Ampelan</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="bg-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>CS Desa Ampelan</span>
              </div>
              <Badge variant="secondary" className="bg-green-500 text-white">
                Online
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender_type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      {message.sender_type === 'user' ? (
                        <>
                          <AvatarImage src={profile?.avatar_url || ''} />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="bg-green-600 text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div
                      className={`rounded-lg p-3 ${
                        message.sender_type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 shadow border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.message}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender_type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-600 text-white text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border rounded-lg p-3 shadow">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tekan Enter untuk mengirim pesan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerServiceChat;
