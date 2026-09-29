import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";

/**
 * Ensures a platform administrator account is securely provisioned in the database.
 * Used on server initialization and automated bootstrapping.
 */
export async function ensureAdminBootstrap(): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : undefined;
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Platform Administrator";

    // 1. Check if any administrator exists in the database
    const existingAdminCount = await prisma.user.count({
      where: { role: "admin" },
    });

    if (existingAdminCount > 0) {
      // Administrator already exists. If explicit config was provided for an email that doesn't exist, provision it.
      if (adminEmail && adminPassword) {
        const targetAdmin = await prisma.user.findUnique({
          where: { email: adminEmail },
        });

        if (!targetAdmin) {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          const created = await prisma.user.create({
            data: {
              email: adminEmail,
              name: adminName,
              password: hashedPassword,
              role: "admin",
              status: "active",
              headline: "Platform Governance & Administrator",
            },
          });
          console.log(`[BOOTSTRAP] Configured administrator provisioned: ${created.email}`);
        }
      }
      return;
    }

    // 2. No administrator exists in the system
    if (process.env.NODE_ENV === "production") {
      if (!adminEmail || !adminPassword) {
        console.error(
          "[BOOTSTRAP FATAL] Production startup error: No administrator exists and ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD are not configured. Refusing to create predictable credentials in production."
        );
        return;
      }
    }

    // In local development, fall back to safe default if unconfigured
    const emailToUse = adminEmail || "admin@consensus.dev";
    const passwordToUse = adminPassword || "password123";

    const hashedPassword = await bcrypt.hash(passwordToUse, 10);
    const created = await prisma.user.create({
      data: {
        email: emailToUse,
        name: adminName,
        password: hashedPassword,
        role: "admin",
        status: "active",
        headline: "Platform Governance & Administrator",
      },
    });

    console.log(`[BOOTSTRAP] Administrator successfully established: ${created.email} (${created.id})`);
  } catch (err) {
    console.error("[BOOTSTRAP] Failed to ensure administrator account:", err);
  }
}
