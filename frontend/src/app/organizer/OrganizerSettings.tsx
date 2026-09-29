import React, { useState } from 'react';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Bell, Check } from 'lucide-react';

export const OrganizerSettings: React.FC = () => {
  const [escrowNotify, setEscrowNotify] = useState(true);
  const [plagiarismThreshold, setPlagiarismThreshold] = useState('85');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Host & Event Console Settings"
        subtitle="Configure platform thresholds, automated notification triggers, and jury deliberation parameters."
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Organizer settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <span>Anti-Sybil & Code Plagiarism Thresholds</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Submissions exceeding this similarity percentage against existing GitHub repositories will automatically be flagged for organizer review.
          </p>
          <Input
            label="AST Diff Similarity Alert Threshold (%)"
            type="number"
            value={plagiarismThreshold}
            onChange={(e) => setPlagiarismThreshold(e.target.value)}
          />
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            <span>Automated Host Notifications</span>
          </h3>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
            <div>
              <p className="font-semibold text-zinc-100">Daily Deliberation Velocity Digest</p>
              <p className="text-[11px] text-zinc-400">Receive morning summary of jury evaluations and pending project reviews.</p>
            </div>
            <input
              type="checkbox"
              checked={escrowNotify}
              onChange={(e) => setEscrowNotify(e.target.checked)}
              className="rounded bg-[#202020] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
            />
          </label>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Save Console Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
