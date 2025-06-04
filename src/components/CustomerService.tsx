
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, MapPin, Wrench, Users, FileText, Settings, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CSMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  category: string;
  status: 'pending' | 'responded' | 'closed';
  timestamp: string;
  response?: string;
}

const CustomerService = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [messages, setMessages] = useState<CSMessage[]>([
    {
      id: '1',
      name: 'Budi Santoso',
      phone: '081234567890',
      message: 'Bagaimana cara mengurus surat domisili?',
      category: 'general',
      status: 'pending',
      timestamp: '2024-06-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Siti Aminah',
      phone: '081234567891',
      message: 'Apakah ada tukang listrik yang bisa dipanggil?',
      category: 'service',
      status: 'responded',
      timestamp: '2024-06-01T09:30:00Z',
      response: 'Ada pak, silakan hubungi Pak Joko di 081234567892'
    }
  ]);
  const { toast } = useToast();

  const categories = [
    {
      id: 'location',
      title: 'Informasi Lokasi',
      icon: MapPin,
      description: 'Tanya lokasi fasilitas umum, kantor desa, dll'
    },
    {
      id: 'service',
      title: 'Tukang Service',
      icon: Wrench,
      description: 'Cari tukang listrik, tukang bangunan, dll'
    },
    {
      id: 'community',
      title: 'Kegiatan Masyarakat',
      icon: Users,
      description: 'Info kegiatan, acara, dan pengumuman'
    },
    {
      id: 'general',
      title: 'Pertanyaan Umum',
      icon: FileText,
      description: 'Pertanyaan lain seputar desa'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    const newMessage: CSMessage = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      category: selectedCategory,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [newMessage, ...prev]);
    
    toast({
      title: "Terkirim!",
      description: "Pesan Anda telah terkirim. Tim CS akan menghubungi Anda segera.",
    });

    // Reset form
    setFormData({ name: '', phone: '', message: '' });
    setSelectedCategory('');
    setIsOpen(false);
  };

  const handleResponse = (messageId: string, response: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'responded' as const, response }
        : msg
    ));
    
    toast({
      title: "Berhasil!",
      description: "Balasan telah dikirim",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'responded': return 'Dibalas';
      case 'closed': return 'Ditutup';
      default: return 'Unknown';
    }
  };

  return (
    <>
      {/* CS Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-green-600 hover:bg-green-700 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* CS Modal */}
      {isOpen && (
        <Card className="fixed bottom-24 left-6 w-96 z-50 shadow-xl border-2 border-green-200 max-h-[600px] overflow-hidden">
          <CardHeader className="pb-3 bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <CardTitle className="text-lg">Customer Service</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {user?.role === 'admin' ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contact" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Kontak
                  </TabsTrigger>
                  <TabsTrigger value="manage" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Kelola
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="contact" className="p-4">
                  {!selectedCategory ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">
                        Pilih kategori pertanyaan Anda:
                      </p>
                      {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className="w-full p-3 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-sm">{category.title}</p>
                                <p className="text-xs text-gray-500">{category.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">
                          {categories.find(c => c.id === selectedCategory)?.title}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory('')}
                          className="text-gray-500"
                        >
                          Kembali
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Masukkan nama Anda"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">No. WhatsApp</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Pesan</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Jelaskan pertanyaan Anda..."
                          rows={3}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Pesan
                      </Button>
                    </form>
                  )}
                </TabsContent>
                
                <TabsContent value="manage" className="p-4 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    <h4 className="font-medium mb-4">Pesan Masuk</h4>
                    {messages.map((msg) => (
                      <Card key={msg.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">{msg.name}</p>
                              <p className="text-xs text-gray-500">{msg.phone}</p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(msg.status)}`}>
                              {getStatusText(msg.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{msg.message}</p>
                          <p className="text-xs text-gray-400 mb-2">
                            {new Date(msg.timestamp).toLocaleString('id-ID')}
                          </p>
                          {msg.response && (
                            <div className="bg-green-50 p-2 rounded text-sm">
                              <strong>Balasan:</strong> {msg.response}
                            </div>
                          )}
                          {msg.status === 'pending' && (
                            <div className="mt-2">
                              <Textarea
                                placeholder="Tulis balasan..."
                                className="text-sm mb-2"
                                rows={2}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    const response = (e.target as HTMLTextAreaElement).value;
                                    if (response.trim()) {
                                      handleResponse(msg.id, response);
                                      (e.target as HTMLTextAreaElement).value = '';
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  const textarea = document.querySelector(`textarea`) as HTMLTextAreaElement;
                                  const response = textarea.value;
                                  if (response.trim()) {
                                    handleResponse(msg.id, response);
                                    textarea.value = '';
                                  }
                                }}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Balas
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="p-4">
                {!selectedCategory ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Pilih kategori pertanyaan Anda:
                    </p>
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className="w-full p-3 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-sm">{category.title}</p>
                              <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">
                        {categories.find(c => c.id === selectedCategory)?.title}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory('')}
                        className="text-gray-500"
                      >
                        Kembali
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama Anda"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">No. WhatsApp</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Jelaskan pertanyaan Anda..."
                        rows={3}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CustomerService;
