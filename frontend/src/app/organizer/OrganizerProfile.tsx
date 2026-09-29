import React, { useState } from 'react';
import { useAuth } from '../../auth/MockAuthProvider';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Building, Globe, Save, Check } from 'lucide-react';

export const OrganizerProfile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Consensus Arena Ops');
  const [org, setOrg] = useState('Consensus Foundation');
  const [website, setWebsite] = useState('https://consensus.dev');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Organizer Organization Profile"
        subtitle="Manage hosting identity, sponsor recognition, and contact channels."
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Organizer profile updated successfully.</span>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-5 mb-6">
          <Avatar name={name} src={user?.avatarUrl} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-zinc-100">{name}</h2>
              <Badge variant="orange" size="sm">Verified Host</Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{org}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Organization / Entity Name"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            icon={<Building className="w-4 h-4" />}
          />
          <Input
            label="Primary Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Official Website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            icon={<Globe className="w-4 h-4" />}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
