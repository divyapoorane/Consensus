import React, { useState } from 'react';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ShieldCheck } from 'lucide-react';

interface GlobalSubmissionFeedItem {
  id: string;
  projectTitle: string;
  squad: string;
  hackathon: string;
  score: number;
  plagiarismRisk: 'Low' | 'Medium' | 'High';
  submittedAt: string;
}

export const SubmissionsAdmin: React.FC = () => {
  const [items] = useState<GlobalSubmissionFeedItem[]>([
    {
      id: 'sub-01',
      projectTitle: 'SynapseAgent: Multi-Modal Consensus Engine',
      squad: 'NeuralForge',
      hackathon: 'Autonomous Systems & AI Arena',
      score: 93.2,
      plagiarismRisk: 'Low',
      submittedAt: 'Sep 24, 2026',
    },
    {
      id: 'sub-02',
      projectTitle: 'SwarmProtocol: Decentralized Task Routing',
      squad: 'AgentMesh',
      hackathon: 'Autonomous Systems & AI Arena',
      score: 88.5,
      plagiarismRisk: 'Low',
      submittedAt: 'Sep 24, 2026',
    },
    {
      id: 'sub-03',
      projectTitle: 'OmniChain Agent Bridge',
      squad: 'CrossLinkers',
      hackathon: 'Autonomous Systems & AI Arena',
      score: 86.0,
      plagiarismRisk: 'Low',
      submittedAt: 'Sep 24, 2026',
    },
    {
      id: 'sub-04',
      projectTitle: 'TerraBit: Eco-Telemetry Grid',
      squad: 'TerraBit',
      hackathon: 'Green Computing & IoT Summit',
      score: 95.0,
      plagiarismRisk: 'Low',
      submittedAt: 'Aug 14, 2026',
    },
  ]);

  const columns: Column<GlobalSubmissionFeedItem>[] = [
    {
      header: 'Submission Title',
      cell: (i) => (
        <div>
          <span className="font-semibold text-zinc-100 block">{i.projectTitle}</span>
          <span className="text-[10px] text-zinc-400 font-mono">By squad: {i.squad}</span>
        </div>
      ),
    },
    {
      header: 'Hackathon Track',
      accessorKey: 'hackathon',
    },
    {
      header: 'Consensus Score',
      cell: (i) => <span className="font-mono font-semibold text-orange-400">{i.score} / 100</span>,
    },
    {
      header: 'AST Code Audit',
      cell: (i) => (
        <Badge variant={i.plagiarismRisk === 'Low' ? 'emerald' : 'rose'} size="sm">
          Risk: {i.plagiarismRisk}
        </Badge>
      ),
    },
    {
      header: 'Date Submitted',
      cell: (i) => <span className="font-mono text-xs text-zinc-400">{i.submittedAt}</span>,
    },
    {
      header: 'Actions',
      cell: (i) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert(`Running deep static analysis on ${i.projectTitle}`)}
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
        >
          Inspect AST
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Global Submissions & Code Audit Feed"
        subtitle="Platform-wide code moderation, AST similarity scanning, and double-blind jury deliberations."
      />
      <Table columns={columns} data={items} keyExtractor={(i) => i.id} />
    </div>
  );
};
