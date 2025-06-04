
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, X, Send, MapPin, Wrench, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerService = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
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

    // Simulate sending message
    console.log('CS Message:', { ...formData, category: selectedCategory });
    
    toast({
      title: "Terkirim!",
      description: "Pesan Anda telah terkirim. Tim CS akan menghubungi Anda segera.",
    });

    // Reset form
    setFormData({ name: '', phone: '', message: '' });
    setSelectedCategory('');
    setIsOpen(false);
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
        <Card className="fixed bottom-24 left-6 w-96 z-50 shadow-xl border-2 border-green-200">
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
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CustomerService;
