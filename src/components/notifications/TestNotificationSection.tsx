
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Bell } from 'lucide-react';

interface TestNotificationSectionProps {
  onTestNotification: () => void;
  onTestPushNotification?: () => void;
  isLoading: boolean;
}

const TestNotificationSection = ({ 
  onTestNotification, 
  onTestPushNotification,
  isLoading 
}: TestNotificationSectionProps) => {
  return (
    <div className="pt-4 border-t space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onTestNotification}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Mail className="w-4 h-4 mr-2" />
          {isLoading ? 'Mengirim...' : 'Test Email'}
        </Button>

        {onTestPushNotification && (
          <Button
            onClick={onTestPushNotification}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <Bell className="w-4 h-4 mr-2" />
            {isLoading ? 'Mengirim...' : 'Test Push'}
          </Button>
        )}
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          * Pastikan email Anda sudah terverifikasi untuk menerima notifikasi email.
        </p>
        <p>
          * Untuk notifikasi push, pastikan browser mendukung dan izin sudah diberikan.
        </p>
        <p>
          * Cek folder spam jika tidak menerima email dalam 5 menit.
        </p>
      </div>
    </div>
  );
};

export default TestNotificationSection;
