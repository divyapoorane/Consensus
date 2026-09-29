import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const dbUrl = process.env.DATABASE_URL || "";
  const nodeEnv = process.env.NODE_ENV || "development";

  console.log("==================================================");
  console.log("CONSENSUS DATABASE CLEANUP & RESET RUNNER");
  console.log("==================================================");
  console.log(`Database URL: ${dbUrl.replace(/:[^:@]+@/, ":****@")}`);
  console.log(`Environment: ${nodeEnv}`);

  // Safety check: Ensure this is the local development/test database
  if (nodeEnv === "production" && !process.env.CONFIRM_PRODUCTION_RESET) {
    console.error("[SAFETY ABORT] Refusing to execute destructive reset in production environment without explicit confirmation.");
    process.exit(1);
  }

  if (!dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1") && !dbUrl.includes("consensus_db")) {
    console.error("[SAFETY ABORT] DATABASE_URL does not appear to be a local consensus_db instance.");
    process.exit(1);
  }

  // Record Pre-cleanup Counts
  const before = {
    auditLogs: await prisma.auditLog.count(),
    disputes: await prisma.dispute.count(),
    certificates: await prisma.certificate.count(),
    payouts: await prisma.payout.count(),
    evaluations: await prisma.evaluation.count(),
    judgeAssignments: await prisma.judgeAssignment.count(),
    submissions: await prisma.submission.count(),
    projects: await prisma.project.count(),
    teamMembers: await prisma.teamMember.count(),
    teams: await prisma.team.count(),
    registrations: await prisma.registration.count(),
    hackathons: await prisma.hackathon.count(),
    users: await prisma.user.count(),
  };

  console.log("\n[PRE-CLEANUP STATUS] Current table counts in database:");
  console.table(before);

  console.log("\nCleaning development/demo/test/sample records in strict dependency order...");

  // Delete all relational operational data
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

  // Delete all demo users (participants, organizers, judges, etc.)
  await prisma.user.deleteMany();

  console.log("All sample/demo/test records wiped.");

  // Provision legitimate, controlled administrator account with clean profile
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@consensus.dev").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD || "password123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Platform Administrator",
      password: hashedPassword,
      role: "admin",
      status: "active",
      headline: "Platform Governance & Administrator",
      skills: [],
      interests: [],
    },
  });

  console.log(`[PROVISIONED] Legitimate Administrator established: ${admin.email} (ID: ${admin.id})`);

  // Record Post-cleanup Counts
  const after = {
    auditLogs: await prisma.auditLog.count(),
    disputes: await prisma.dispute.count(),
    certificates: await prisma.certificate.count(),
    payouts: await prisma.payout.count(),
    evaluations: await prisma.evaluation.count(),
    judgeAssignments: await prisma.judgeAssignment.count(),
    submissions: await prisma.submission.count(),
    projects: await prisma.project.count(),
    teamMembers: await prisma.teamMember.count(),
    teams: await prisma.team.count(),
    registrations: await prisma.registration.count(),
    hackathons: await prisma.hackathon.count(),
    users: await prisma.user.count(),
  };

  console.log("\n[POST-CLEANUP STATUS] Clean database table counts:");
  console.table(after);
  console.log("==================================================");
  console.log("DATA CLEANUP COMPLETE: Zero fake hackathons, zero fake participants, zero fake teams/projects/submissions.");
  console.log("==================================================");
}

main()
  .catch((err) => {
    console.error("[RESET ERROR] Failed to clean database:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
