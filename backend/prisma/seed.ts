import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding consensus_db with core models + 5 demo features...");

  // Clean existing tables in reverse order of dependencies
  await prisma.auditLog.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.judgeAssignment.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Users
  const participant = await prisma.user.create({
    data: {
      id: "usr-001",
      email: "participant@consensus.dev",
      password: hashedPassword,
      name: "Alex Vance",
      role: "participant",
      headline: "Full-Stack & Autonomous Systems Engineer",
      bio: "Specializing in distributed systems, Rust, React, and smart contracts.",
      college: "Massachusetts Institute of Technology",
      course: "B.S. Computer Science",
      graduationYear: "2027",
      currentRole: "Student & Core Protocol Contributor",
      skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL"],
      interests: ["AI Agents", "Consensus Algorithms", "Cloud Architecture"],
      github: "https://github.com/alexvance-dev",
      linkedin: "https://linkedin.com/in/alexvance-dev",
      portfolio: "https://alexvance.dev",
      country: "United States",
      state: "Massachusetts",
      city: "Cambridge",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
  });

  const teammate = await prisma.user.create({
    data: {
      id: "usr-005",
      email: "elena@consensus.dev",
      password: hashedPassword,
      name: "Elena Rostova",
      role: "participant",
      headline: "Distributed Systems & Machine Learning Engineer",
      skills: ["Python", "Rust", "Docker", "PyTorch"],
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
  });

  const organizer = await prisma.user.create({
    data: {
      id: "usr-002",
      email: "organizer@consensus.dev",
      password: hashedPassword,
      name: "Consensus Arena Ops",
      role: "organizer",
      headline: "Lead Hackathon Program Director",
      title: "Director of Hackathon Operations",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    },
  });

  const judge = await prisma.user.create({
    data: {
      id: "usr-003",
      email: "judge@consensus.dev",
      password: hashedPassword,
      name: "Dr. Sarah Lin",
      role: "judge",
      headline: "Research Director & Juror Panelist",
      title: "Principal Research Scientist",
      organization: "Consensus Labs",
      bio: "Researching decentralized consensus, zero knowledge, and scalable architectures.",
      skills: ["Decentralized Systems", "Security Auditing", "Consensus Protocol"],
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: "usr-004",
      email: "admin@consensus.dev",
      password: hashedPassword,
      name: "Consensus Chief Admin",
      role: "admin",
      headline: "Platform Operations & Governance Lead",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    },
  });

  console.log("Demo users created.");

  // 2. Create Hackathons
  const hackathon1 = await prisma.hackathon.create({
    data: {
      id: "hack-01",
      title: "Autonomous Systems & AI Arena",
      tagline: "Scale decentralized autonomous agent clusters with deterministic reasoning.",
      description: "Build robust multi-agent swarms capable of self-healing task coordination, consensus verification, and automated peer evaluation under network latency constraints.",
      category: "Autonomous Systems & AI",
      bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      status: "active",
      registrationStart: "2026-10-01",
      registrationEnd: "2026-10-15",
      hackathonStart: "2026-10-16",
      hackathonEnd: "2026-10-25",
      submissionDeadline: "2026-10-24T23:59:00Z",
      judgingPeriod: "Oct 25 – Oct 28, 2026",
      resultsDate: "2026-10-29",
      format: "team",
      minTeamSize: 1,
      maxTeamSize: 4,
      eligibility: "Open to all builders aged 18+ globally.",
      geographicRestrictions: "No restrictions (Global)",
      requirements: [
        "Public GitHub repository",
        "Live working URL endpoint",
        "3-minute pitch video walkthrough",
        "Architecture diagram",
      ],
      totalPrizePool: "$50,000",
      organizerId: organizer.id,
      organizerName: organizer.name,
      organizerEmail: organizer.email,
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      id: "hack-02",
      title: "Decentralized Tech & Web3 Sprint",
      tagline: "Build high-throughput zero-knowledge verification dApps and trustless primitives.",
      description: "Harness next-generation cryptographic primitives, state machines, and zero-knowledge rollups to deploy decentralized identity and governance mechanisms.",
      category: "Decentralized Tech & Web3",
      bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      status: "active",
      registrationStart: "2026-09-15",
      registrationEnd: "2026-10-05",
      hackathonStart: "2026-10-06",
      hackathonEnd: "2026-10-20",
      submissionDeadline: "2026-10-19T23:59:00Z",
      judgingPeriod: "Oct 20 – Oct 23, 2026",
      resultsDate: "2026-10-24",
      format: "team",
      minTeamSize: 1,
      maxTeamSize: 5,
      eligibility: "Open to collegiate and independent developers worldwide.",
      totalPrizePool: "$35,000",
      organizerId: organizer.id,
      organizerName: organizer.name,
      organizerEmail: organizer.email,
    },
  });

  const hackathon3 = await prisma.hackathon.create({
    data: {
      id: "hack-03",
      title: "Developer Tooling & Cloud Infrastructure",
      tagline: "Next-generation CLI, observability, and automated CI/CD for cloud-native stacks.",
      description: "Build developer productivity tools, kernel tracing utilities, edge deployment frameworks, and observability pipelines.",
      category: "Developer Tooling & Cloud",
      bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      status: "published",
      registrationStart: "2026-11-01",
      registrationEnd: "2026-11-15",
      hackathonStart: "2026-11-16",
      hackathonEnd: "2026-11-30",
      submissionDeadline: "2026-11-29T23:59:00Z",
      format: "both",
      minTeamSize: 1,
      maxTeamSize: 4,
      totalPrizePool: "$25,000",
      organizerId: organizer.id,
      organizerName: organizer.name,
      organizerEmail: organizer.email,
    },
  });

  // 3. Registrations
  await prisma.registration.create({
    data: {
      hackathonId: hackathon1.id,
      userId: participant.id,
      status: "confirmed",
    },
  });

  await prisma.registration.create({
    data: {
      hackathonId: hackathon2.id,
      userId: participant.id,
      status: "confirmed",
    },
  });

  await prisma.registration.create({
    data: {
      hackathonId: hackathon1.id,
      userId: teammate.id,
      status: "confirmed",
    },
  });

  // 4. Team
  const team1 = await prisma.team.create({
    data: {
      id: "team-01",
      name: "Synapse Squad",
      hackathonId: hackathon1.id,
      leaderId: participant.id,
      inviteCode: "SYN-8492",
      maxMembers: 4,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: participant.id,
      role: "Team Lead",
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: teammate.id,
      role: "Full Stack Member",
    },
  });

  // 5. Project
  const project1 = await prisma.project.create({
    data: {
      id: "proj-01",
      hackathonId: hackathon1.id,
      teamId: team1.id,
      creatorId: participant.id,
      title: "SynapseAgent: Autonomous Consensus",
      tagline: "A verifiable deterministic agent orchestrator for decentralized consensus.",
      description: "SynapseAgent coordinates multi-node AI agents through cryptographic attestation proofs, verifying each agent's execution output before consensus commitment. Includes self-healing failovers and automated double-blind verification channels.",
      techStack: ["TypeScript", "Python", "FastAPI", "React", "PostgreSQL", "Docker"],
      repositoryUrl: "https://github.com/consensus-arena/synapse-agent",
      demoUrl: "https://synapse-agent.demo.consensus.dev",
      documentationUrl: "https://docs.synapse-agent.dev",
      videoUrl: "https://youtu.be/synapse-demo",
      status: "Submitted",
    },
  });

  // 6. Submission
  const submission1 = await prisma.submission.create({
    data: {
      id: "sub-01",
      projectId: project1.id,
      hackathonId: hackathon1.id,
      teamId: team1.id,
      submitterId: participant.id,
      status: "evaluated",
      validationStatus: "Passed",
      judgingStatus: "Scoring Completed",
      score: 88,
      maxScore: 100,
      feedback: "Strong architectural foundation. The consensus fallback algorithm is well thought out and executed with high fidelity.",
    },
  });

  // 7. Judge Assignment
  await prisma.judgeAssignment.create({
    data: {
      judgeId: judge.id,
      hackathonId: hackathon1.id,
      projectId: project1.id,
      status: "completed",
    },
  });

  // 8. Evaluation
  await prisma.evaluation.create({
    data: {
      judgeId: judge.id,
      projectId: project1.id,
      submissionId: submission1.id,
      innovation: 18,
      technicalQuality: 26,
      uiUx: 13,
      impact: 17,
      presentation: 14,
      totalScore: 88,
      feedback: "Strong architectural foundation. The consensus fallback algorithm is well thought out and executed with high fidelity.",
      privateNotes: "Checked git commit logs — verified clean origin.",
      recommendForAward: true,
    },
  });

  // 9. Demo Payouts
  await prisma.payout.create({
    data: {
      payoutId: "DEMO-TXN-001",
      hackathonId: hackathon1.id,
      hackathonTitle: hackathon1.title,
      teamId: team1.id,
      winnerTeam: "Synapse Squad",
      recipientEmail: "participant@consensus.dev",
      prizeTitle: "Grand Consensus Winner",
      amount: "$25,000",
      status: "completed",
      payoutMethod: "Simulated Escrow (Demo)",
      isDemo: true,
      completedAt: new Date(),
    },
  });

  await prisma.payout.create({
    data: {
      payoutId: "DEMO-TXN-002",
      hackathonId: hackathon1.id,
      hackathonTitle: hackathon1.title,
      winnerTeam: "AgentZero Lab",
      recipientEmail: "elena@consensus.dev",
      prizeTitle: "Runner-Up Track Excellence",
      amount: "$15,000",
      status: "pending",
      payoutMethod: "Simulated Escrow (Demo)",
      isDemo: true,
    },
  });

  await prisma.payout.create({
    data: {
      payoutId: "DEMO-TXN-003",
      hackathonId: hackathon2.id,
      hackathonTitle: hackathon2.title,
      winnerTeam: "ZK Rollup Squad",
      recipientEmail: "builder@zkforge.dev",
      prizeTitle: "ZK Innovation Grand Prize",
      amount: "$10,000",
      status: "held_for_review",
      payoutMethod: "Simulated Escrow (Demo)",
      isDemo: true,
    },
  });

  console.log("Demo payouts created.");

  // 10. Demo Certificates
  await prisma.certificate.create({
    data: {
      certificateId: "CERT-CNS-2026-901",
      recipientName: "Alex Vance",
      recipientEmail: "participant@consensus.dev",
      type: "winner",
      hackathonId: hackathon1.id,
      hackathonTitle: hackathon1.title,
      achievement: "Grand Consensus Winner — 1st Place",
      status: "issued",
      issuedAt: new Date(),
    },
  });

  await prisma.certificate.create({
    data: {
      certificateId: "CERT-CNS-2026-902",
      recipientName: "Dr. Sarah Lin",
      recipientEmail: "judge@consensus.dev",
      type: "judge",
      hackathonId: hackathon1.id,
      hackathonTitle: hackathon1.title,
      achievement: "Lead Consensus Juror & Evaluator",
      status: "issued",
      issuedAt: new Date(),
    },
  });

  await prisma.certificate.create({
    data: {
      certificateId: "CERT-CNS-2026-903",
      recipientName: "Elena Rostova",
      recipientEmail: "elena@consensus.dev",
      type: "participant",
      hackathonId: hackathon1.id,
      hackathonTitle: hackathon1.title,
      achievement: "Verified Track Finalist & Contributor",
      status: "draft",
    },
  });

  console.log("Demo certificates created.");

  // 11. Demo Disputes
  await prisma.dispute.create({
    data: {
      disputeId: "DSP-4091",
      complainantName: "Alex Vance",
      complainantEmail: "participant@consensus.dev",
      complainantRole: "participant",
      hackathonId: hackathon1.id,
      hackathonTitle: hackathon1.title,
      projectId: project1.id,
      projectTitle: project1.title,
      category: "Plagiarism / Code Theft",
      priority: "high",
      status: "OPEN",
      description: "Requesting automated verification check on commit timing for competing submodule repository.",
    },
  });

  await prisma.dispute.create({
    data: {
      disputeId: "DSP-4092",
      complainantName: "Elena Rostova",
      complainantEmail: "elena@consensus.dev",
      complainantRole: "participant",
      hackathonId: hackathon2.id,
      hackathonTitle: hackathon2.title,
      category: "Judging Bias",
      priority: "medium",
      status: "RESOLVED",
      description: "Clarification request on benchmark scoring weights for latency measurements.",
      resolutionNotes: "Audit logs confirmed juror evaluation was within normal standard deviation limits. Rubric weights re-verified.",
    },
  });

  console.log("Demo disputes created.");

  // 12. Demo Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userEmail: "admin@consensus.dev",
        userRole: "admin",
        action: "PLATFORM_INITIALIZATION",
        resource: "System Root",
        entityType: "System",
        status: "SUCCESS",
        metadata: "Consensus Hackathon Platform bootstrapped with PostgreSQL engine.",
      },
      {
        userEmail: "organizer@consensus.dev",
        userRole: "organizer",
        action: "HACKATHON_DEPLOYED",
        resource: "Autonomous Systems & AI Arena",
        entityType: "Hackathon",
        entityId: hackathon1.id,
        status: "SUCCESS",
        metadata: "Deployed track with $50,000 escrow allocation.",
      },
      {
        userEmail: "participant@consensus.dev",
        userRole: "participant",
        action: "PROJECT_SUBMISSION",
        resource: "SynapseAgent: Autonomous Consensus",
        entityType: "Submission",
        entityId: submission1.id,
        status: "SUCCESS",
        metadata: "Submitted repository with automated test passing proofs.",
      },
      {
        userEmail: "judge@consensus.dev",
        userRole: "judge",
        action: "JURY_EVALUATION_COMMITTED",
        resource: "SynapseAgent: Autonomous Consensus",
        entityType: "Evaluation",
        status: "SUCCESS",
        metadata: "Juror composite score of 88/100 recorded to double-blind ledger.",
      },
      {
        userEmail: "organizer@consensus.dev",
        userRole: "organizer",
        action: "ESCROW_DISBURSEMENT_INITIATED",
        resource: "DEMO-TXN-001 ($25,000)",
        entityType: "Payout",
        entityId: "DEMO-TXN-001",
        status: "SUCCESS",
        metadata: "Simulated prize disbursement released to Synapse Squad.",
      },
    ],
  });

  console.log("Demo audit logs created.");
  console.log("Seeding complete! Database is fully populated with all 5 new demo features.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
