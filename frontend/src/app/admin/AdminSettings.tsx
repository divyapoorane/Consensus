import React, { useState } from 'react';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Sliders, Check } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [varianceTolerance, setVarianceTolerance] = useState('0.45');
  const [rateLimitMax, setRateLimitMax] = useState('120');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Platform Governance & System Parameters"
        subtitle="Configure mathematical consensus algorithms, global rate limits, and security thresholds."
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>System parameters updated across all Consensus nodes.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span>Consensus Engine Deliberation Matrix</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Governs the automated outlier rejection dampening applied when an empaneled juror deviates from the panel mean.
          </p>
          <Input
            label="Jury Variance Sigma Threshold (Standard Deviations)"
            value={varianceTolerance}
            onChange={(e) => setVarianceTolerance(e.target.value)}
            helperText="Default: 0.45 sigma. Values below 0.3 apply aggressive dampening."
          />
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <span>Anti-Sybil & Rate Limiting Engine</span>
          </h3>
          <Input
            label="Global Anonymous IP Rate Limit (req/min)"
            type="number"
            value={rateLimitMax}
            onChange={(e) => setRateLimitMax(e.target.value)}
          />

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A] cursor-pointer text-xs">
            <div>
              <p className="font-semibold text-zinc-100">Emergency Maintenance Mode</p>
              <p className="text-[11px] text-zinc-400">Restricts platform to read-only mode during database migrations.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="rounded bg-[#202020] border-[#2A2A2A] text-rose-500 focus:ring-0"
            />
          </label>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Save System Parameters
          </Button>
        </div>
      </form>
    </div>
  );
};
