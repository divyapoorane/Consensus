import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participant/participantService';
import { ParticipantTeam, ParticipantHackathon } from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Users,
  PlusCircle,
  UserPlus,
  Copy,
  Check,
  Shield,
  FolderGit2,
  Lock,
  Sparkles,
  Radio,
  Cpu,
} from 'lucide-react';

export const ParticipantTeams: React.FC = () => {
  const [teams, setTeams] = useState<ParticipantTeam[]>([]);
  const [enrolledHackathons, setEnrolledHackathons] = useState<ParticipantHackathon[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    participantService.getTeams().then(setTeams);
    participantService.getHackathons().then((hList) => {
      setEnrolledHackathons(hList);
      if (hList.length > 0) {
        setSelectedHackathonId(hList[0].id);
      }
    });
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const targetHack = enrolledHackathons.find((h) => h.id === selectedHackathonId) || enrolledHackathons[0];
    if (!targetHack?.id) return;

    const created = await participantService.createTeam({
      name: newTeamName,
      hackathonId: targetHack.id,
      hackathonTitle: targetHack.title,
    });

    setTeams([created, ...teams]);
    setNewTeamName('');
    setCreateModalOpen(false);
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    const joined = await participantService.joinTeam(inviteCodeInput);
    if (joined) {
      setTeams([...teams.map((t) => (t.id === joined.id ? joined : t))]);
      setInviteCodeInput('');
      setJoinModalOpen(false);
    } else {
      alert('Invalid squad invite code. Please check and retry.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Squad Command Header */}
      <DashboardHeader
        title="Squad Command"
        subtitle="Manage active engineering units, inspect member orbital constellations, and issue encrypted join codes."
        badge={<StatusBeacon status="connected" label="CONSTELLATION ACTIVE" />}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJoinModalOpen(true)}
              icon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Enter Join Code
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              icon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Mobilize Squad
            </Button>
          </div>
        }
      />

      {teams.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-[#FF5500]" />}
          title="No mobilized squads on this telemetry channel"
          description="Form a multidisciplinary engineering squad to divide tasks, build codebases, and coordinate submissions under your squad banner."
          actionLabel="Mobilize Squad"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {teams.map((team) => {
            const leader = team.members.find((m) => m.isLeader) || team.members[0];
            const otherMembers = team.members.filter((m) => m.id !== leader?.id);
            const emptySlots = Math.max(0, (team.maxMembers || 4) - team.members.length);

            return (
              <div
                key={team.id}
                className="bg-[#0D1220]/95 border border-[#182238] rounded-xl p-5 sm:p-7 space-y-6 relative overflow-hidden shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#00F0FF]/40 before:to-transparent"
              >
                {/* Squad Command Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#182238]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <TechnicalLabel label="SQUAD" value={team.name} variant="cyan" />
                      <Badge variant={team.myRole === 'Team Leader' ? 'orange' : 'slate'} size="sm">
                        {team.myRole}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#8E9BB5] px-2 py-0.5 rounded bg-[#090D18] border border-[#182238]">
                        {team.hackathonTitle}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#8E9BB5]">
                      ROSTER STATUS: <strong className="text-[#00F0FF]">{team.members.length}</strong> /{' '}
                      <strong className="text-[#F0F4FC]">{team.maxMembers}</strong> SLOTS FILLED
                    </p>
                  </div>

                  {/* Cryptographic Join Code Box */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#090D18] border border-[#182238]">
                    <Lock className="w-3.5 h-3.5 text-[#FF5500] flex-shrink-0" />
                    <div className="text-left">
                      <span className="text-[9px] font-mono uppercase text-[#8E9BB5] block">
                        JOIN CODE
                      </span>
                      <code className="text-xs font-mono font-bold text-[#00F0FF] tracking-wider">
                        {team.inviteCode}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopyCode(team.inviteCode)}
                      title="Copy Squad Join Code"
                      className="p-1.5 rounded bg-[#11182B] hover:bg-[#162038] text-xs font-mono text-[#F0F4FC] transition-colors ml-1 cursor-pointer"
                    >
                      {copiedCode === team.inviteCode ? (
                        <Check className="w-3.5 h-3.5 text-[#00E575]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#8E9BB5]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Linked Project Notice if present */}
                {team.projectTitle && (
                  <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#8E9BB5] font-mono">
                      <FolderGit2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
                      <span>ATTACHED WORKSPACE:</span>
                      <strong className="text-[#F0F4FC]">{team.projectTitle}</strong>
                    </div>
                    <StatusBeacon status="connected" label="LINKED" />
                  </div>
                )}

                {/* ORBITAL SQUAD CONSTELLATION VIEW */}
                <div className="relative bg-[#090D18] border border-[#182238] rounded-xl p-6 sm:p-8 overflow-hidden">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#182238]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E9BB5] font-semibold">
                      SQUAD CONSTELLATION TOPOLOGY
                    </span>
                    <span className="text-[10px] font-mono text-[#00E575]">
                      ● SQUAD LEADER AT APEX
                    </span>
                  </div>

                  {/* Constellation Grid (Leader Central, Members Radiating) */}
                  <div className="flex flex-col items-center justify-center gap-6">
                    {/* Central Leader Node */}
                    {leader && (
                      <div className="relative flex flex-col items-center text-center group">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-[#0D1220] border-2 border-[#FF5500] flex items-center justify-center shadow-[0_0_25px_rgba(255,85,0,0.35)]">
                            <Avatar name={leader.name} src={leader.avatarUrl} size="lg" />
                          </div>
                          <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#FF5500] text-white">
                            <Shield className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="mt-2.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF5500] font-bold block">
                            CENTRAL APEX // LEADER
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-[#F0F4FC] font-mono uppercase">
                            {leader.name}
                          </p>
                          <span className="text-[10px] font-mono text-[#00F0FF] block">
                            {leader.role || 'Full-Stack Architecture'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SVG Connector Lines from Leader to Squad Members */}
                    <div className="w-full flex justify-center -my-2 pointer-events-none">
                      <svg width="360" height="32" className="overflow-visible stroke-current text-[#182238]">
                        <path d="M 180 0 L 180 16 L 40 16 L 40 32" fill="none" strokeWidth="1.5" />
                        <path d="M 180 0 L 180 32" fill="none" strokeWidth="1.5" />
                        <path d="M 180 0 L 180 16 L 320 16 L 320 32" fill="none" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* Orbiting Squad Members & Empty Slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                      {otherMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-4 rounded-xl bg-[#0D1220] border border-[#182238] hover:border-[#00F0FF]/40 transition-all flex flex-col items-center text-center space-y-2 group"
                        >
                          <div className="relative">
                            <Avatar name={member.name} src={member.avatarUrl} size="md" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00E575]" />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase text-[#8E9BB5] block">
                              SQUAD MEMBER
                            </span>
                            <p className="text-xs font-bold text-[#F0F4FC] font-mono uppercase">
                              {member.name}
                            </p>
                            <span className="text-[10px] font-mono text-[#00F0FF] block truncate">
                              {member.role || 'Contributor'}
                            </span>
                            <p className="text-[10px] text-[#8E9BB5] truncate font-mono mt-0.5">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Empty Open Builder Slots */}
                      {Array.from({ length: emptySlots }).map((_, slotIdx) => (
                        <div
                          key={`empty-${slotIdx}`}
                          className="p-4 rounded-xl border border-dashed border-[#182238] bg-[#06080F]/40 flex flex-col items-center justify-center text-center space-y-1.5 min-h-[130px]"
                        >
                          <Users className="w-5 h-5 text-[#8E9BB5] opacity-40" />
                          <span className="text-[10px] font-mono text-[#8E9BB5] uppercase font-bold">
                            Open Orbit Slot
                          </span>
                          <span className="text-[9px] font-mono text-[#4B556D]">
                            Share join code to assign
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Squad */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Mobilize New Squad"
        subtitle="Establish an engineering squad for an enrolled hackathon track and generate cryptographic join codes."
      >
        <form onSubmit={handleCreateTeam} className="space-y-4 pt-2">
          {enrolledHackathons.length === 0 ? (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 font-mono">
              You must be registered for at least one hackathon track before mobilizing a squad.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] font-bold text-[#8E9BB5] uppercase tracking-wider">
                Hackathon Sprint
              </label>
              <select
                value={selectedHackathonId}
                onChange={(e) => setSelectedHackathonId(e.target.value)}
                className="w-full bg-[#090D18] border border-[#182238] rounded-lg p-2.5 text-[#F0F4FC] focus:border-[#00F0FF] focus:outline-none text-xs font-mono"
              >
                {enrolledHackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Squad Unit Name"
            required
            placeholder="e.g. NeuralForge Labs"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <div className="text-xs text-[#8E9BB5] p-3 rounded-lg bg-[#090D18] border border-[#182238] font-mono">
            You will automatically be assigned as <strong className="text-[#00F0FF]">Squad Leader</strong>. You can distribute join codes to teammates.
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm & Mobilize
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Join Squad */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join an Existing Squad"
        subtitle="Enter the encrypted join code provided by your squad leader."
      >
        <form onSubmit={handleJoinTeam} className="space-y-4 pt-2">
          <Input
            label="Squad Join Code"
            required
            placeholder="e.g. NF-8921-X"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value)}
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Validate & Join Squad
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
