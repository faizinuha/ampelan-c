
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, User, Phone, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/auth';
import AvatarUpload from '@/components/AvatarUpload';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Profile>>({});

  if (!user || !profile) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      full_name: profile.full_name,
      phone: profile.phone || '',
      address: profile.address || '',
      rt_rw: profile.rt_rw || '',
      occupation: profile.occupation || ''
    });
  };

  const handleSave = async () => {
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
      setEditData({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleAvatarUpdate = async (url: string) => {
    await updateProfile({ avatar_url: url });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profil Pengguna</span>
          </CardTitle>
          {!isEditing ? (
            <Button onClick={handleEdit} size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline">
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and basic info */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <AvatarUpload
            currentAvatar={profile.avatar_url}
            userName={profile.full_name}
            onAvatarUpdate={handleAvatarUpdate}
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold">{profile.full_name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
              {profile.role === 'admin' ? 'Administrator' : 'Warga'}
            </Badge>
          </div>
        </div>

        {/* Profile details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Nama Lengkap</span>
            </Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={editData.full_name || ''}
                onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{profile.full_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Nomor Telepon</span>
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={editData.phone || ''}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                placeholder="Masukkan nomor telepon"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{profile.phone || 'Belum diisi'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Alamat</span>
            </Label>
            {isEditing ? (
              <Input
                id="address"
                value={editData.address || ''}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
                placeholder="Masukkan alamat lengkap"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{profile.address || 'Belum diisi'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="rt_rw">RT/RW</Label>
            {isEditing ? (
              <Input
                id="rt_rw"
                value={editData.rt_rw || ''}
                onChange={(e) => setEditData({...editData, rt_rw: e.target.value})}
                placeholder="Contoh: RT 01/RW 02"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{profile.rt_rw || 'Belum diisi'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="occupation" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Pekerjaan</span>
            </Label>
            {isEditing ? (
              <Input
                id="occupation"
                value={editData.occupation || ''}
                onChange={(e) => setEditData({...editData, occupation: e.target.value})}
                placeholder="Masukkan pekerjaan"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 p-2 bg-gray-50 rounded">{profile.occupation || 'Belum diisi'}</p>
            )}
          </div>
        </div>

        {/* Additional info */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Bergabung:</span>
              <p>{new Date(profile.created_at).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <span className="font-medium">Terakhir diperbarui:</span>
              <p>{new Date(profile.updated_at).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
