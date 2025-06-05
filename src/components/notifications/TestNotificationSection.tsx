
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface TestNotificationSectionProps {
  onTestNotification: () => void;
  isLoading: boolean;
}

const TestNotificationSection = ({ onTestNotification, isLoading }: TestNotificationSectionProps) => {
  return (
    <div className="pt-4 border-t">
      <Button
        onClick={onTestNotification}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        <Mail className="w-4 h-4 mr-2" />
        {isLoading ? 'Mengirim...' : 'Test Notifikasi Email'}
      </Button>
      
      <div className="text-xs text-gray-500 mt-4">
        <p>
          * Pastikan email Anda sudah terverifikasi untuk menerima notifikasi.
        </p>
        <p>
          * Cek folder spam jika tidak menerima email dalam 5 menit.
        </p>
      </div>
    </div>
  );
};

export default TestNotificationSection;
