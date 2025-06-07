
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Trash2, Check, X, User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeletionRequest {
  id: string;
  user_id: string;
  profile_data: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    rt_rw?: string;
    occupation?: string;
    role: string;
    created_at: string;
    avatar_url?: string;
  };
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

const AccountDeletionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null);

  useEffect(() => {
    fetchDeletionRequests();
  }, []);

  const fetchDeletionRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching deletion requests:', error);
      toast({
        title: "Error",
        description: "Gagal memuat permintaan penghapusan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processRequest = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!user) return;

    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: action,
          admin_notes: adminNotes || null,
          processed_by: user.id,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // If approved, we would need additional logic to actually delete the user
      // This is just updating the request status for now
      
      toast({
        title: "Berhasil",
        description: `Permintaan ${action === 'approved' ? 'disetujui' : 'ditolak'}`,
      });

      await fetchDeletionRequests();
      setAdminNotes('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: "Gagal memproses permintaan",
        variant: "destructive",
      });
    } finally {
      setProcessingId('');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const labels = {
      pending: 'Menunggu Review',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center p-4">Memuat permintaan penghapusan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manajemen Penghapusan Akun</h2>
        <Badge variant="outline">
          {requests.filter(r => r.status === 'pending').length} Menunggu Review
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Tidak ada permintaan penghapusan akun
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className={`${request.status === 'pending' ? 'border-orange-200 bg-orange-50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {request.profile_data.full_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.created_at).toLocaleDateString('id-ID')}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Informasi Pengguna</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {request.profile_data.email}
                      </div>
                      {request.profile_data.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {request.profile_data.phone}
                        </div>
                      )}
                      {request.profile_data.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {request.profile_data.address}
                          {request.profile_data.rt_rw && ` (${request.profile_data.rt_rw})`}
                        </div>
                      )}
                      {request.profile_data.occupation && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {request.profile_data.occupation}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{request.profile_data.role}</Badge>
                        <span className="text-xs text-gray-500">
                          Bergabung: {new Date(request.profile_data.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {request.reason && (
                      <div>
                        <h4 className="font-medium">Alasan Penghapusan</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {request.reason}
                        </p>
                      </div>
                    )}
                    
                    {request.admin_notes && (
                      <div>
                        <h4 className="font-medium">Catatan Admin</h4>
                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                          {request.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Setujui
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Setujui Penghapusan Akun</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menyetujui penghapusan akun untuk {request.profile_data.full_name}?
                            Tindakan ini akan menghapus semua data pengguna secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Label htmlFor="notes">Catatan Admin (opsional)</Label>
                          <Textarea
                            id="notes"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Tambahkan catatan untuk keputusan ini..."
                            className="mt-1"
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setAdminNotes('')}>
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => processRequest(request.id, 'approved')}
                            disabled={processingId === request.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {processingId === request.id ? 'Memproses...' : 'Ya, Setujui'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Tolak
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tolak Penghapusan Akun</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menolak permintaan penghapusan akun untuk {request.profile_data.full_name}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Label htmlFor="reject-notes">Alasan Penolakan</Label>
                          <Textarea
                            id="reject-notes"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Berikan alasan mengapa permintaan ditolak..."
                            className="mt-1"
                            required
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setAdminNotes('')}>
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => processRequest(request.id, 'rejected')}
                            disabled={processingId === request.id || !adminNotes.trim()}
                          >
                            {processingId === request.id ? 'Memproses...' : 'Ya, Tolak'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountDeletionManagement;
