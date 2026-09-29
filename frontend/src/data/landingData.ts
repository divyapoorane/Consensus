import { EcosystemRoleInfo, HackathonCardData } from '../types';

export const ECOSYSTEM_ROLES: EcosystemRoleInfo[] = [
  {
    id: 'participant',
    emoji: '👨‍💻',
    title: 'Participants',
    tagline: 'Build & compete',
    overview:
      'Engineered for hackers, engineers, designers, and innovators. Join upcoming sprints, find cross-disciplinary teammates, access starter kits, and submit working code.',
    capabilities: [
      'Discover active and upcoming hackathons across global tracks',
      'Instant squad formation and skill-matching teammate finder',
      'Submit projects with live demos, repositories, and documentation',
      'Track real-time leaderboard milestones and judge consensus reviews',
      'Earn verifiable credentials and portfolio recognition',
    ],
    primaryAction: 'Join as Participant',
  },
  {
    id: 'organizer',
    emoji: '🏢',
    title: 'Organizers',
    tagline: 'Create & manage hackathons',
    overview:
      'Launch customized hackathons with automated registration gates, milestone tracking, sponsor prize tracks, and consensus-based jury administration.',
    capabilities: [
      'Configure custom hackathon tracks, timelines, and prize structures',
      'Define multi-criteria scoring rubrics with weighted consensus rules',
      'Manage participant applications, team limits, and submission deadlines',
      'Broadcast announcements, live workshop links, and mentor hours',
      'Automate prize disbursements and post-event analytics reports',
    ],
    primaryAction: 'Host a Hackathon',
  },
  {
    id: 'judge',
    emoji: '⚖️',
    title: 'Judges',
    tagline: 'Review & score projects',
    overview:
      'Conduct impartial, double-blind evaluations using standardized rubrics. The consensus scoring engine flags variances and normalizes juror evaluations.',
    capabilities: [
      'Access double-blind submission queues with private juror notes',
      'Score projects across technical execution, innovation, design, and impact',
      'Live deliberation room with automated outlier detection',
      'Consensus matrix calculation ensuring zero unfair skew',
      'Provide structured feedback directly to participating teams',
    ],
    primaryAction: 'Apply to Judge',
  },
  {
    id: 'admin',
    emoji: '🛡️',
    title: 'Admins',
    tagline: 'Control the platform',
    overview:
      'Manage global platform governance, approve incoming hackathon applications, oversee user moderation, and configure system-wide consensus protocols.',
    capabilities: [
      'Approve, draft, and publish new hackathons and featured slots',
      'Role-based access control (RBAC) across participants, judges, and hosts',
      'Platform-wide audit logs, security monitoring, and report escalation',
      'Escrow fund verification and institutional compliance checks',
      'Configure global taxonomies, tags, and category templates',
    ],
    primaryAction: 'Open Admin Console',
  },
];

// Clean template cards ready for Admin population as instructed
export const DEFAULT_HACKATHON_SLOTS: HackathonCardData[] = [
  {
    id: 'slot-alpha',
    title: '[Hackathon Track A — Slot Open]',
    category: 'Autonomous Systems & AI',
    tagline: 'Template slot for organizer deployment. Awaiting timeline and challenge parameters.',
    date: 'TBA by Admin',
    participants: 'Registration Pending',
    teamSize: '1 – 4 Builders',
    prizePool: 'TBA by Host',
    status: 'Upcoming',
    tags: ['AI Agents', 'Open Track', 'Global'],
  },
  {
    id: 'slot-beta',
    title: '[Hackathon Track B — Slot Open]',
    category: 'Decentralized Tech & Web3',
    tagline: 'Template slot ready for jury assignment and challenge brief publication.',
    date: 'TBA by Admin',
    participants: 'Registration Pending',
    teamSize: '2 – 5 Builders',
    prizePool: 'TBA by Host',
    status: 'Upcoming',
    tags: ['Smart Contracts', 'Zero-Knowledge', 'Web3'],
  },
  {
    id: 'slot-gamma',
    title: '[Hackathon Track C — Slot Open]',
    category: 'Developer Tooling & Cloud',
    tagline: 'Template slot configured for developer experience and infrastructure challenges.',
    date: 'TBA by Admin',
    participants: 'Draft State',
    teamSize: '1 – 4 Builders',
    prizePool: 'TBA by Host',
    status: 'Draft',
    tags: ['DevTools', 'Infrastructure', 'Open Source'],
  },
  {
    id: 'slot-delta',
    title: '[Hackathon Track D — Slot Open]',
    category: 'Climate & Hardware Systems',
    tagline: 'Template slot ready for sensor networks and planetary data submissions.',
    date: 'TBA by Admin',
    participants: 'Registration Pending',
    teamSize: '1 – 6 Builders',
    prizePool: 'TBA by Host',
    status: 'TBA',
    tags: ['IoT', 'Climate', 'Hardware'],
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    name: 'Discover',
    tagline: 'Explore Open Arena Tracks',
    description:
      'Inspect verified global challenges, explore problem briefs across AI, systems, and open source, and review track-specific rubrics and escrow prize pools.',
    iconName: 'Compass',
    highlight: 'Curated technical tracks & transparent criteria',
  },
  {
    step: '02',
    name: 'Form a Squad',
    tagline: 'Cryptographic Squad Rooms',
    description:
      'Form engineering teams or enter as solo builders. Generate secure 8-character invite codes, match complemental skills, and establish team leadership.',
    iconName: 'Users',
    highlight: 'Instant invite codes & team formation gates',
  },
  {
    step: '03',
    name: 'Build',
    tagline: 'Developer Engineering Workspace',
    description:
      'Link your Git repositories, register live deployments, draft technical architecture documentation, and test against challenge requirements.',
    iconName: 'Code2',
    highlight: 'Git repo integration & live deployment staging',
  },
  {
    step: '04',
    name: 'Submit',
    tagline: 'Pre-Flight Launch Checklist',
    description:
      'Verify deliverables against automated pre-flight checks: public repository commit hashes, working HTTPS endpoints, and architectural documentation.',
    iconName: 'Send',
    highlight: 'Automated pre-flight verification gate',
  },
  {
    step: '05',
    name: 'Consensus',
    tagline: 'Double-Blind Jury Evaluation',
    description:
      'Empaneled jurors evaluate submissions with author identities masked. Mathematical outlier detection normalizes variance for impartial meritocratic scoring.',
    iconName: 'Scale',
    highlight: 'Double-blind reviews & variance normalization',
  },
  {
    step: '06',
    name: 'Results',
    tagline: 'Verified Escrow & Showcase Gallery',
    description:
      'Final composite scores publish transparently to the project gallery, verifiable certificates are generated, and escrow prize pools disburse.',
    iconName: 'Award',
    highlight: 'Permanent showcase & verifiable credential issuance',
  },
];

