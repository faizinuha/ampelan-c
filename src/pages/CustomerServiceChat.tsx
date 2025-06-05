
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  sender?: string;
}

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

const CustomerServiceChat = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faqData: FAQItem[] = [
    {
      question: "Bagaimana cara mengurus surat domisili?",
      answer: "Untuk mengurus surat domisili, Anda perlu membawa: 1) KTP asli dan fotocopy, 2) KK asli dan fotocopy, 3) Surat pengantar dari RT/RW. Datang ke kantor desa pada jam kerja (08:00-15:00) hari Senin-Jumat.",
      keywords: ["surat", "domisili", "ktp", "kk", "rt", "rw"]
    },
    {
      question: "Dimana lokasi kantor desa?",
      answer: "Kantor Desa Ampelan berlokasi di Jl. Raya Desa Ampelan No. 123, buka Senin-Jumat jam 08:00-15:00. Anda bisa menghubungi (0271) 123456 untuk informasi lebih lanjut.",
      keywords: ["lokasi", "kantor", "desa", "alamat", "jam", "buka", "telepon"]
    },
    {
      question: "Ada tukang listrik yang bisa dipanggil?",
      answer: "Ya, ada beberapa tukang listrik di desa: 1) Pak Joko (081234567892), 2) Pak Budi (081234567893). Mereka melayani perbaikan listrik rumah 24 jam.",
      keywords: ["tukang", "listrik", "perbaikan", "joko", "budi", "24 jam"]
    },
    {
      question: "Kapan ada kegiatan posyandu?",
      answer: "Posyandu rutin dilaksanakan setiap Rabu minggu ke-2 dan ke-4 setiap bulan di Balai Desa, jam 09:00-12:00. Bawa buku KIA untuk balita dan KTP untuk ibu hamil.",
      keywords: ["posyandu", "rabu", "balai", "desa", "kia", "balita", "ibu", "hamil"]
    },
    {
      question: "Bagaimana cara daftar bantuan sosial?",
      answer: "Pendaftaran bantuan sosial dibuka setiap 6 bulan sekali. Syarat: 1) KTP Desa Ampelan, 2) KK, 3) Surat keterangan tidak mampu dari RT/RW. Info pendaftaran akan diumumkan di website dan papan pengumuman desa.",
      keywords: ["bantuan", "sosial", "daftar", "ktp", "kk", "tidak", "mampu", "rt", "rw"]
    }
  ];

  useEffect(() => {
    // Welcome message when component mounts
    const welcomeMessage: Message = {
      id: '1',
      type: 'system',
      content: `Selamat datang di Customer Service Desa Ampelan! 👋\n\n${user ? `Halo, ${profile?.full_name || user.name}!` : 'Halo!'} Saya adalah asisten virtual yang siap membantu Anda.\n\nAnda bisa bertanya tentang:\n• Layanan administrasi desa\n• Lokasi fasilitas umum\n• Kontak tukang/jasa\n• Kegiatan masyarakat\n• Informasi umum lainnya\n\nSilakan ketik pertanyaan Anda!`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findBestAnswer = (userMessage: string): string | null => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Find FAQ with most matching keywords
    let bestMatch: FAQItem | null = null;
    let maxScore = 0;
    
    faqData.forEach(faq => {
      let score = 0;
      faq.keywords.forEach(keyword => {
        if (lowercaseMessage.includes(keyword.toLowerCase())) {
          score++;
        }
      });
      
      if (score > maxScore && score > 0) {
        maxScore = score;
        bestMatch = faq;
      }
    });
    
    return bestMatch ? bestMatch.answer : null;
  };

  const getDefaultResponse = (): string => {
    const responses = [
      "Terima kasih atas pertanyaan Anda. Untuk informasi lebih detail, silakan hubungi kantor desa di (0271) 123456 atau datang langsung ke Jl. Raya Desa Ampelan No. 123.",
      "Maaf, saya belum memiliki informasi spesifik untuk pertanyaan tersebut. Tim customer service kami akan segera menghubungi Anda. Atau Anda bisa langsung ke kantor desa untuk bantuan lebih lanjut.",
      "Pertanyaan Anda sudah saya catat. Untuk jawaban yang lebih akurat, silakan menghubungi petugas desa di jam kerja (08:00-15:00) atau WhatsApp ke 08123456789."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      sender: profile?.full_name || user?.name || 'Anda'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate typing
    simulateTyping();

    // Get bot response
    setTimeout(() => {
      const botAnswer = findBestAnswer(inputMessage) || getDefaultResponse();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botAnswer,
        timestamp: new Date(),
        sender: 'CS Desa Ampelan'
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      {message.type === 'user' ? (
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
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-gray-100 text-gray-800 border'
                          : 'bg-white text-gray-800 shadow border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
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

            {/* Input Area */}
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
