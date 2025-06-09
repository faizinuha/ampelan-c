
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send } from 'lucide-react';

interface DocumentSubmissionFormProps {
  documentType?: string;
  trigger?: React.ReactNode;
}

const DocumentSubmissionForm = ({ documentType, trigger }: DocumentSubmissionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    document_type: documentType || '',
    purpose: ''
  });

  const documentTypes = [
    'Surat Keterangan',
    'Surat Domisili',
    'Surat Usaha',
    'Surat Keterangan Tidak Mampu',
    'Surat Pengantar',
    'Surat Keterangan Kelahiran',
    'Surat Keterangan Kematian',
    'Surat Keterangan Pindah'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!formData.document_type || !formData.purpose) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('document_submissions')
        .insert([{
          user_id: user.id,
          document_type: formData.document_type,
          purpose: formData.purpose
        }]);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Pengajuan dokumen berhasil dikirim. Anda akan mendapat notifikasi setelah diproses.",
      });

      setFormData({ document_type: documentType || '', purpose: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting document:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pengajuan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-green-600 hover:bg-green-700 text-white">
      <FileText className="w-4 h-4 mr-2" />
      Ajukan Sekarang
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Ajukan Dokumen
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="document_type">Jenis Dokumen</Label>
            <Select 
              value={formData.document_type} 
              onValueChange={(value) => setFormData({ ...formData, document_type: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih jenis dokumen" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purpose">Keperluan / Tujuan</Label>
            <Textarea
              id="purpose"
              placeholder="Jelaskan keperluan atau tujuan pengajuan dokumen ini..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pengajuan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSubmissionForm;
