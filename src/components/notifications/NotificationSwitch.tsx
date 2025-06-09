
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface NotificationSwitchProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const NotificationSwitch = ({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: NotificationSwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </Label>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};

export default NotificationSwitch;
