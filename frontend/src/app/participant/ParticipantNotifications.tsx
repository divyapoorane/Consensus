import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participant/participantService';
import { ParticipantNotification } from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';

export const ParticipantNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<ParticipantNotification[]>([]);

  useEffect(() => {
    participantService.getNotifications().then(setNotifications);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-[#FF6B35]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Notifications & Feed"
        subtitle="Stay updated on sprint deadlines, squad invitations, jury deliberations, and payout confirmations."
        action={
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark All Read
          </Button>
        }
      />

      <div className="space-y-2.5">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`p-4 flex items-start justify-between gap-4 transition-colors ${
              !notif.read ? 'bg-[#1C1C1C] border-[#383838]' : 'bg-[#181818] opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#202020] border border-[#2A2A2A] mt-0.5 flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#F5F5F0]">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#A1A1A1] leading-relaxed">{notif.message}</p>
                <span className="text-[10px] font-mono text-[#666666] block">{notif.timestamp}</span>
              </div>
            </div>

            {!notif.read && (
              <button
                onClick={() => {
                  participantService.markNotificationRead(notif.id);
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                  );
                }}
                className="text-[#A1A1A1] hover:text-[#F5F5F0] p-1 text-xs cursor-pointer"
                title="Mark as read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
