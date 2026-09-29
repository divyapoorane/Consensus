import React, { useState } from 'react';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Bell, Wallet, Check } from 'lucide-react';

export const ParticipantSettings: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('0x71C...84F2');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [juryAlerts, setJuryAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader
        title="Participant Settings"
        subtitle="Manage account preferences, prize payout addresses, and notification triggers."
      />

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* Prize Payout Destination */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
              Prize Payout Vault & Wallet
            </h3>
          </div>
          <p className="text-xs text-[#A1A1A1]">
            Escrow rewards from completed hackathon tracks are automatically disbursed to this verified address or ACH banking destination.
          </p>
          <Input
            label="Ethereum / EVM Address or USDC Recipient"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            helperText="Used for zero-fee escrow settlements upon winner confirmation."
          />
        </Card>

        {/* Notification Preferences */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer">
              <div>
                <p className="font-medium text-[#F5F5F0]">Sprint Deadline Reminders</p>
                <p className="text-[11px] text-[#A1A1A1]">Receive alerts 48h, 24h, and 2h before submission lock.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] cursor-pointer">
              <div>
                <p className="font-medium text-[#F5F5F0]">Jury Deliberation Updates</p>
                <p className="text-[11px] text-[#A1A1A1]">Get notified when jurors post score breakdowns or feedback.</p>
              </div>
              <input
                type="checkbox"
                checked={juryAlerts}
                onChange={(e) => setJuryAlerts(e.target.checked)}
                className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
              />
            </label>
          </div>
        </Card>

        {/* Security & Access */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider">
              Security & Passkey
            </h3>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] text-xs">
            <div>
              <p className="font-medium text-[#F5F5F0]">Hardware Key / WebAuthn</p>
              <p className="text-[11px] text-[#A1A1A1]">Fast biometric authentication for submission signing.</p>
            </div>
            <Button variant="outline" size="sm">
              Enable Key
            </Button>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
