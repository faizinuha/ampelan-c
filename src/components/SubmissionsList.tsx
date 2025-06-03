
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentSubmission } from '@/types/submissions';
import { FileText, Clock, CheckCircle, XCircle, Eye, Edit3 } from 'lucide-react';

interface SubmissionsListProps {
  isAdmin?: boolean;
}

const SubmissionsList = ({ isAdmin = false }: SubmissionsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<DocumentSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSubmissions = async () => {
    try {
      let query = supabase.from('document_submissions').select('*');
      
      if (!isAdmin && user) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengajuan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user, isAdmin]);

  const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('document_submissions')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: `Pengajuan berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`,
      });

      fetchSubmissions();
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status pengajuan",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {isAdmin ? 'Semua Pengajuan Dokumen' : 'Riwayat Pengajuan Dokumen'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {isAdmin ? 'Belum ada pengajuan' : 'Belum ada pengajuan dokumen'}
            </h3>
            <p className="text-gray-500">
              {isAdmin ? 'Belum ada pengajuan dokumen dari warga' : 'Anda belum pernah mengajukan dokumen'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis Dokumen</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.document_type}</TableCell>
                    <TableCell className="max-w-xs truncate">{submission.purpose}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>{new Date(submission.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setAdminNotes(submission.admin_notes || '');
                            }}
                          >
                            {isAdmin ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Detail Pengajuan</DialogTitle>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Jenis Dokumen:</label>
                                <p className="text-gray-700">{selectedSubmission.document_type}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Keperluan:</label>
                                <p className="text-gray-700">{selectedSubmission.purpose}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status:</label>
                                <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Tanggal Pengajuan:</label>
                                <p className="text-gray-700">{new Date(selectedSubmission.created_at).toLocaleString('id-ID')}</p>
                              </div>
                              
                              {isAdmin && (
                                <div className="border-t pt-4">
                                  <label className="text-sm font-medium">Catatan Admin:</label>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Tambahkan catatan..."
                                    className="mt-1"
                                    rows={3}
                                  />
                                  <div className="flex space-x-2 mt-4">
                                    <Button
                                      onClick={() => updateSubmissionStatus(selectedSubmission.id, 'approved')}
                                      disabled={isUpdating}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Setujui
                                    </Button>
                                    <Button
                                      onClick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}
                                      disabled={isUpdating}
                                      variant="destructive"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Tolak
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {selectedSubmission.admin_notes && !isAdmin && (
                                <div>
                                  <label className="text-sm font-medium">Catatan Admin:</label>
                                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedSubmission.admin_notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
