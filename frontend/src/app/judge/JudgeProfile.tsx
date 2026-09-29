import React, { useState, useEffect } from 'react';
import { judgeService } from '../../services/judge/judgeService';
import { JudgeProfile as IJudgeProfile } from '../../types/judge';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Building, Save, Check } from 'lucide-react';

export const JudgeProfile: React.FC = () => {
  const [profile, setProfile] = useState<IJudgeProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    judgeService.getProfile().then(setProfile);
  }, []);

  if (!profile) return <div className="p-8 text-center text-zinc-400">Loading juror profile...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await judgeService.updateProfile(profile);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Juror Profile"
        subtitle="Manage academic credentials, research domain specializations, and empanelment records."
        action={
          !isEditing ? (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )
        }
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Juror profile updated successfully.</span>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-5 mb-6">
          <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-zinc-100">{profile.name}</h2>
              <Badge variant="orange" size="sm">Empaneled Juror</Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{profile.title} • {profile.organization}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            value={profile.name}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Input
            label="Professional Title"
            value={profile.title}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
          />
          <Input
            label="Institution / Lab"
            value={profile.organization}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
            icon={<Building className="w-4 h-4" />}
          />
          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-medium text-zinc-300 uppercase tracking-wider text-[11px]">
              Research Biography
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-[#FF6B35] text-xs disabled:opacity-70"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-300 mb-2 uppercase tracking-wider">
              Research & Judging Specializations
            </label>
            <div className="flex flex-wrap gap-1.5">
              {profile.expertise.map((exp) => (
                <Badge key={exp} variant="neutral" size="sm">
                  {exp}
                </Badge>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};
