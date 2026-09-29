import React from 'react';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Scale, Video } from 'lucide-react';

export const JudgeNotifications: React.FC = () => {
  const notifications = [
    {
      id: '1',
      title: 'Batch Assignment Alert',
      message: '3 new projects in the Autonomous Systems track have submitted final code and are ready for scoring.',
      time: '1 hour ago',
      icon: <Scale className="w-4 h-4 text-orange-400" />,
    },
    {
      id: '2',
      title: 'Demo Day Pitch Reminder',
      message: 'Live presentation with squad NeuralForge commences today at 15:30 UTC.',
      time: '3 hours ago',
      icon: <Video className="w-4 h-4 text-zinc-400" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Juror Notifications"
        subtitle="Jury empanelment alerts, review deadlines, and deliberation room invites."
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#141414] border border-[#2A2A2A] mt-0.5">
              {n.icon}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">{n.title}</h4>
              <p className="text-xs text-zinc-300 mt-0.5">{n.message}</p>
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block">{n.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
