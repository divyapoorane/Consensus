import React, { useState } from 'react';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Bell, Check } from 'lucide-react';

export const JudgeSettings: React.FC = () => {
  const [doubleBlindAuto, setDoubleBlindAuto] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Juror Portal Settings"
        subtitle="Manage privacy settings, review alerts, and evaluation workspace options."
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Juror settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Double-Blind Deliberation Gate</span>
          </h3>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
            <div>
              <p className="font-semibold text-zinc-100">Strict Anonymization Protocol</p>
              <p className="text-[11px] text-zinc-400">Hide participant names, avatars, and universities until scoring is locked.</p>
            </div>
            <input
              type="checkbox"
              checked={doubleBlindAuto}
              onChange={(e) => setDoubleBlindAuto(e.target.checked)}
              className="rounded bg-[#202020] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
            />
          </label>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            <span>Live Presentation Alerts</span>
          </h3>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
            <div>
              <p className="font-semibold text-zinc-100">Demo Day 15-Minute Pitch Alarms</p>
              <p className="text-[11px] text-zinc-400">Push notifications before scheduled finalist pitch sessions.</p>
            </div>
            <input
              type="checkbox"
              checked={sessionReminders}
              onChange={(e) => setSessionReminders(e.target.checked)}
              className="rounded bg-[#202020] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
            />
          </label>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
