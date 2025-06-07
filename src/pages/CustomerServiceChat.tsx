
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Bot, User, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomerServiceChat } from '@/hooks/useCustomerServiceChat';
import { ChatHeader } from '@/components/customerService/ChatHeader';
import { ChatMessage } from '@/components/customerService/ChatMessage';
import { ChatInput } from '@/components/customerService/ChatInput';
import { TypingIndicator } from '@/components/customerService/TypingIndicator';

const CustomerServiceChat = () => {
  const { user, profile } = useAuth();
  const { messages, sendMessage, isTyping } = useCustomerServiceChat();
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    'Jam operasional kantor desa',
    'Cara mengurus surat keterangan',
    'Informasi bantuan sosial',
    'Prosedur pengurusan domisili',
    'Kontak kepala desa',
    'Agenda kegiatan desa'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Customer Service</h1>
                <p className="text-sm text-gray-600">Desa Ampelan</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online 24/7
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-4">
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
                    <span>+62 xxx-xxxx-xxxx</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>cs@ampelan.id</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Pertanyaan Populer</h4>
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
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl h-[70vh] flex flex-col">
              <ChatHeader />

              <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Selamat datang di Customer Service Desa Ampelan!
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Saya siap membantu Anda dengan pertanyaan seputar layanan desa, prosedur administrasi, dan informasi lainnya.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                          {quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-left justify-start text-green-600 border-green-200 hover:bg-green-50"
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
                  onSendMessage={handleSendMessage}
                  onKeyPress={handleKeyPress}
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setInputMessage('Bagaimana cara mengurus surat keterangan?')}
              >
                📄 Surat Keterangan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => setInputMessage('Informasi bantuan sosial terbaru')}
              >
                🤝 Bantuan Sosial
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                onClick={() => setInputMessage('Jadwal kegiatan desa bulan ini')}
              >
                📅 Kegiatan Desa
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                onClick={() => setInputMessage('Kontak penting desa')}
              >
                📞 Kontak
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceChat;
