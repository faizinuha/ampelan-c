
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const CustomerServiceChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Selamat datang di Customer Service Desa Ampelan. Ada yang bisa saya bantu?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('surat') || lowerMessage.includes('dokumen')) {
      return 'Untuk pengurusan surat, Anda bisa menggunakan layanan online kami. Silakan klik tombol "Layanan Online" di beranda atau beri tahu saya jenis surat apa yang Anda butuhkan.';
    }
    
    if (lowerMessage.includes('jam') || lowerMessage.includes('buka')) {
      return 'Kantor desa buka setiap hari Senin-Jumat pukul 08.00-16.00 WIB. Kami siap melayani Anda!';
    }
    
    if (lowerMessage.includes('lokasi') || lowerMessage.includes('alamat')) {
      return 'Kantor Desa Ampelan berlokasi di Jl. Desa Ampelan No. 123. Anda juga bisa menggunakan layanan online kami untuk kemudahan.';
    }
    
    if (lowerMessage.includes('bantuan') || lowerMessage.includes('sosial')) {
      return 'Untuk informasi bantuan sosial, silakan hubungi bagian kesejahteraan desa atau datang langsung ke kantor desa dengan membawa KTP dan KK.';
    }
    
    return 'Terima kasih atas pertanyaan Anda. Tim customer service kami akan segera merespons. Untuk layanan yang lebih cepat, silakan gunakan layanan online kami di beranda.';
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Customer Service</h1>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-center text-green-600">Chat dengan Customer Service</CardTitle>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Pertanyaan Umum</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => setInputMessage('Bagaimana cara mengurus surat keterangan?')}
              >
                Cara mengurus surat keterangan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => setInputMessage('Jam buka kantor desa')}
              >
                Jam buka kantor desa
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => setInputMessage('Lokasi kantor desa')}
              >
                Lokasi kantor desa
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Kontak Langsung</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 Telepon: (021) 1234-5678</p>
              <p>📧 Email: info@desampelan.id</p>
              <p>🏢 Alamat: Jl. Desa Ampelan No. 123</p>
              <p>⏰ Senin-Jumat, 08.00-16.00 WIB</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceChat;
