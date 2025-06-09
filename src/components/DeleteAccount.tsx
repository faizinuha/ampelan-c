
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DeleteAccount = () => {
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteRequest = async () => {
    if (!user || !profile) return;
    
    if (confirmText !== 'HAPUS AKUN SAYA') {
      toast({
        title: "Error",
        description: "Ketik 'HAPUS AKUN SAYA' untuk konfirmasi",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create deletion request with complete profile data
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert([{
          user_id: user.id,
          profile_data: {
            full_name: profile.full_name,
            email: user.email,
            phone: profile.phone,
            address: profile.address,
            rt_rw: profile.rt_rw,
            occupation: profile.occupation,
            role: profile.role,
            created_at: profile.created_at,
            avatar_url: profile.avatar_url
          },
          reason: reason || null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Permintaan Dikirim",
        description: "Permintaan penghapusan akun telah dikirim ke admin untuk review. Anda akan menerima notifikasi melalui email.",
        duration: 6000,
      });

      // Reset form
      setReason('');
      setConfirmText('');
      
    } catch (error) {
      console.error('Delete request error:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim permintaan penghapusan akun",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Trash2 className="w-5 h-5" />
          Hapus Akun
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-red-800">Peringatan Penting</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Semua data pribadi Anda akan dihapus permanen</li>
                <li>• Tindakan ini tidak dapat dibatalkan</li>
                <li>• Permintaan akan direview oleh admin terlebih dahulu</li>
                <li>• Proses penghapusan dapat memakan waktu 1-7 hari kerja</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Alasan Penghapusan (Opsional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Berikan alasan mengapa Anda ingin menghapus akun..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="confirm">
              Ketik "HAPUS AKUN SAYA" untuk konfirmasi
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="HAPUS AKUN SAYA"
              className="mt-1"
            />
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full"
              disabled={confirmText !== 'HAPUS AKUN SAYA'}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Kirim Permintaan Penghapusan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Penghapusan Akun</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mengirim permintaan penghapusan akun? 
                Permintaan ini akan direview oleh admin dan tidak dapat dibatalkan 
                setelah disetujui.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRequest}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Mengirim...' : 'Ya, Kirim Permintaan'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default DeleteAccount;
