import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizerService } from '../../services/organizer/organizerService';
import { HackathonConfig } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  ArrowLeft,
  Check,
} from 'lucide-react';

export const HackathonManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState<HackathonConfig | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      organizerService.getHackathonById(id).then((data) => {
        if (data) setHackathon(data);
        else {
          organizerService.getHackathons().then((all) => setHackathon(all[0] || null));
        }
      });
    }
  }, [id]);

  if (!hackathon) {
    return <div className="p-8 text-center text-[#A1A1A1]">Loading hackathon track...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackathon) return;
    await organizerService.updateHackathon(hackathon.id, hackathon);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <button
        onClick={() => navigate('/organizer/hackathons')}
        className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A1] hover:text-[#F5F5F0] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      <DashboardHeader
        title={hackathon.name}
        subtitle="Manage configurations, juror panels, rubric criteria weights, and prize tiers."
        badge={<Badge variant="slate">{hackathon.status}</Badge>}
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/organizer/judging')}
          >
            Judging Overview
          </Button>
        }
      />

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Hackathon settings updated successfully.</span>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <span className="text-[10px] uppercase font-mono text-[#A1A1A1] block mb-1">
            Registered Builders
          </span>
          <span className="text-xl font-bold text-[#F5F5F0] font-mono">
            {hackathon.registrationsCount}
          </span>
        </Card>
        <Card>
          <span className="text-[10px] uppercase font-mono text-[#A1A1A1] block mb-1">
            Delivered Codebases
          </span>
          <span className="text-xl font-bold text-[#F5F5F0] font-mono">
            {hackathon.submissionsCount}
          </span>
        </Card>
        <Card>
          <span className="text-[10px] uppercase font-mono text-[#A1A1A1] block mb-1">
            Prize Escrow Pool
          </span>
          <span className="text-xl font-bold text-[#FF7F50] font-mono">
            {hackathon.prizes.totalPool}
          </span>
        </Card>
        <Card>
          <span className="text-[10px] uppercase font-mono text-[#A1A1A1] block mb-1">
            Jury Consensus Mode
          </span>
          <span className="text-sm font-semibold text-emerald-400">
            {hackathon.judging.blindJudging ? 'Double-Blind' : 'Standard'}
          </span>
        </Card>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Track Metadata */}
        <Card className="space-y-3.5">
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
            Track Metadata & Description
          </h3>
          <Input
            label="Hackathon Name"
            value={hackathon.name}
            onChange={(e) => setHackathon({ ...hackathon, name: e.target.value })}
          />
          <Input
            label="Tagline"
            value={hackathon.tagline}
            onChange={(e) => setHackathon({ ...hackathon, tagline: e.target.value })}
          />
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-medium text-[#A1A1A1]">
              Challenge Description
            </label>
            <textarea
              rows={3}
              value={hackathon.description}
              onChange={(e) => setHackathon({ ...hackathon, description: e.target.value })}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg p-2.5 text-[#F5F5F0] focus:outline-none focus:border-[#FF6B35] text-xs"
            />
          </div>
        </Card>

        {/* Rubric Criteria Summary */}
        <Card className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
              Scoring Rubric Criteria ({hackathon.judging.rubric.length})
            </h3>
            <span className="text-xs text-[#A1A1A1] font-mono">
              Required Jurors: {hackathon.judging.requiredJudgesPerProject} / project
            </span>
          </div>

          <div className="space-y-2">
            {hackathon.judging.rubric.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-[#F5F5F0] block">{r.name}</span>
                  <span className="text-[11px] text-[#A1A1A1]">{r.description}</span>
                </div>
                <span className="font-mono font-semibold text-[#FF7F50] text-sm">{r.weight}%</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="submit" variant="primary" size="md">
            Save Modifications
          </Button>
        </div>
      </form>
    </div>
  );
};
