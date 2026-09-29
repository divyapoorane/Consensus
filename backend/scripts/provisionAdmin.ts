import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const name = args[1];
  const password = args[2];

  if (!email || !name || !password) {
    console.error("Usage: npx tsx scripts/provisionAdmin.ts <email> <name> <password>");
    console.error("All three parameters (<email> <name> <password>) are required.");
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "admin",
        status: "active",
        ...(password ? { password: hashedPassword } : {}),
      },
    });
    console.log(`[SUCCESS] Existing user promoted to Administrator: ${updated.email} (${updated.id})`);
  } else {
    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        password: hashedPassword,
        role: "admin",
        status: "active",
        headline: "Platform Administrator",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
    });
    console.log(`[SUCCESS] New Administrator provisioned: ${created.email} (${created.id})`);
  }
}

main()
  .catch((err) => {
    console.error("[ERROR] Failed to provision administrator:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
