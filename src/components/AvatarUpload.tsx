import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Camera, Check, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName: string;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUpload = ({ currentAvatar, userName, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      // Create canvas for cropped image
      const canvas = canvasRef.current;
      const image = imageRef.current;
      
      if (canvas && image) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 200;
          canvas.height = 200;
          
          // Draw cropped image
          ctx.drawImage(
            image,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            200,
            200
          );
          
          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            if (blob) {
              const fileName = `${user.id}/avatar-${Date.now()}.jpg`;
              
              // Delete old avatar if exists
              if (currentAvatar) {
                const oldPath = currentAvatar.split('/').pop();
                if (oldPath) {
                  await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
                }
              }
              
              // Upload new avatar
              const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, blob, {
                  contentType: 'image/jpeg',
                  upsert: true
                });

              if (error) throw error;

              // Get public URL
              const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

              onAvatarUpdate(publicUrl);
              setIsOpen(false);
              setSelectedFile(null);
              setPreviewUrl('');
              
              toast({
                title: "Berhasil",
                description: "Foto profil berhasil diperbarui",
              });
            }
          }, 'image/jpeg', 0.8);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload foto profil",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={currentAvatar || ''} alt={userName} />
          <AvatarFallback className="text-lg bg-green-100 text-green-700">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Foto Profil</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {!selectedFile ? (
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Maksimal 5MB, format JPG/PNG
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      ref={imageRef}
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-64 object-contain"
                      onLoad={() => {
                        // Reset crop area when image loads
                        setCropArea({ x: 0, y: 0, width: 200, height: 200 });
                      }}
                    />
                  </div>
                  
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Batal
                    </Button>
                    <Button
                      onClick={uploadAvatar}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Simpan'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AvatarUpload;
