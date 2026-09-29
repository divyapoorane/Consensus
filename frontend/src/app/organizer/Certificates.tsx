import React, { useState, useEffect } from 'react';
import { organizerService } from '../../services/organizer/organizerService';
import { OrganizerCertificate } from '../../types/organizer';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { OrbitalRing } from '../../components/orbital/OrbitalRing';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Download,
  Plus,
  Award,
  FileCheck,
  RefreshCw,
  Info,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  QrCode,
  FileCode,
} from 'lucide-react';

export const Certificates: React.FC = () => {
  const [certs, setCerts] = useState<OrganizerCertificate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCert, setNewCert] = useState({
    recipientName: '',
    recipientEmail: '',
    type: 'winner' as 'winner' | 'participant' | 'judge',
    hackathonTitle: 'Autonomous Systems & AI Arena',
  });

  const loadCertificates = () => {
    organizerService.getCertificates().then(setCerts);
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleIssue = async (id: string) => {
    await organizerService.issueCertificate({ id });
    loadCertificates();
  };

  const handleDownload = (c: OrganizerCertificate) => {
    const url = organizerService.getCertificateDownloadUrl(c.id);
    window.open(url, '_blank');
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.recipientName || !newCert.recipientEmail) return;

    setIsSubmitting(true);
    try {
      await organizerService.issueCertificate({
        recipientName: newCert.recipientName,
        recipientEmail: newCert.recipientEmail,
        type: newCert.type,
        hackathonTitle: newCert.hackathonTitle,
        status: 'issued',
      });
      setIsModalOpen(false);
      setNewCert({
        recipientName: '',
        recipientEmail: '',
        type: 'winner',
        hackathonTitle: 'Autonomous Systems & AI Arena',
      });
      loadCertificates();
    } catch (err) {
      console.error('Failed to issue certificate:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<OrganizerCertificate>[] = [
    {
      header: 'Recipient',
      cell: (c) => (
        <div>
          <span className="font-semibold text-white block">{c.recipientName}</span>
          <span className="text-[10px] text-zinc-400 font-mono">{c.recipientEmail}</span>
        </div>
      ),
    },
    {
      header: 'Credential Type',
      cell: (c) => (
        <Badge
          variant={c.type === 'winner' ? 'orange' : c.type === 'judge' ? 'cyan' : 'neutral'}
          size="sm"
        >
          {c.type.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathonTitle',
    },
    {
      header: 'Cryptographic Status',
      cell: (c) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase flex items-center gap-1.5 w-fit ${
            c.status === 'issued'
              ? 'bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/30'
              : 'bg-[#0D1220] text-zinc-400 border border-white/10'
          }`}
        >
          <StatusBeacon color={c.status === 'issued' ? 'green' : 'amber'} size="sm" />
          {c.status}
        </span>
      ),
    },
    {
      header: 'Credential Actions',
      cell: (c) =>
        c.status === 'draft' ? (
          <Button variant="primary" size="sm" onClick={() => handleIssue(c.id)}>
            Issue & Sign
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(c)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download PDF
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Achievement Archive // Digital Credentials"
        subtitle="Manage and disburse cryptographically verifiable credentials, vector PDF diplomas, and digital badges to hackathon winners, jurors, and finalists."
        badge={
          <span className="text-[10px] font-mono bg-[#0D1220] text-[#00F0FF] border border-[#00F0FF]/30 px-2.5 py-0.5 rounded-full uppercase font-medium flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <StatusBeacon color="cyan" size="sm" pulse />
            <span>CREDENTIAL LEDGER // ACTIVE</span>
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadCertificates} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Issue Certificate
            </Button>
          </div>
        }
      />

      {/* Holographic Credential Specimen Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Holographic Specimen Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#090D18] border border-[#00F0FF]/40 rounded-2xl p-5 relative overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.12)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded border border-[#00F0FF]/30 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#00F0FF]" />
                VERIFIED CREDENTIAL SPECIMEN
              </span>
              <FileCheck className="w-4 h-4 text-[#00F0FF]" />
            </div>

            <div className="p-4 rounded-xl bg-[#06080F] border border-white/10 space-y-2.5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">ISSUED BY CONSENSUS PLATFORM</div>
              <h4 className="text-base font-bold text-white font-display">
                Certificate of Track Excellence
              </h4>
              <p className="text-xs text-zinc-400">
                Awarded for verified implementation of multi-agent consensus protocols and superior architecture.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>HASH: 0x8f2a...7c9b</span>
                <span className="text-[#00E575]">DIGITALLY SIGNED</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-white/5 mt-4 relative z-10">
            <span>VECTOR PDF ENGINE</span>
            <span className="text-[#00F0FF]">SHA-256 INTEGRITY</span>
          </div>
        </div>

        {/* Real Server PDF Engine Telemetry (7 cols) */}
        <div className="lg:col-span-7 bg-[#090D18] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00E575]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Cryptographic PDF Streaming Engine
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consensus streams authentic server-rendered PDF certificates generated on the fly via Node.js + PDFKit. Documents contain geometric orbital borders, digital certificate hashes, issuer signatures, and permanent tamper-evident timestamps.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Total Issued</div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">{certs.length}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Signed & Sealed</div>
              <div className="text-xl font-bold text-[#00E575] font-mono mt-0.5">
                {certs.filter((c) => c.status === 'issued').length}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Verification Level</div>
              <div className="text-xl font-bold text-[#00F0FF] font-mono mt-0.5">Tier 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* CERTIFICATE LEDGER */}
      <SystemPanel coordinate="LEDGER:CREDENTIALS" status="VERIFIED">
        <Table columns={columns} data={certs} keyExtractor={(c) => c.id} />
      </SystemPanel>

      {/* Issue Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Verifiable Certificate"
        subtitle="Generate and digitally sign a credential document for a participant, winner, or juror."
      >
        <form onSubmit={handleCreateCertificate} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">RECIPIENT FULL NAME</label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Patel"
              value={newCert.recipientName}
              onChange={(e) => setNewCert({ ...newCert, recipientName: e.target.value })}
              className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF5500] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">RECIPIENT EMAIL</label>
            <input
              type="email"
              required
              placeholder="e.g. maya@consensus.dev"
              value={newCert.recipientEmail}
              onChange={(e) => setNewCert({ ...newCert, recipientEmail: e.target.value })}
              className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF5500] font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">CREDENTIAL TYPE</label>
              <select
                value={newCert.type}
                onChange={(e) => setNewCert({ ...newCert, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF5500] font-mono"
              >
                <option value="winner">Winner / Track Champion</option>
                <option value="participant">Participant / Finalist</option>
                <option value="judge">Empaneled Juror</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">HACKATHON TRACK</label>
              <input
                type="text"
                value={newCert.hackathonTitle}
                onChange={(e) => setNewCert({ ...newCert, hackathonTitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF5500] font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Generating PDF...' : 'Issue & Sign Certificate'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
