import { Request } from "express";
import { prisma } from "../prisma.js";

export async function logAudit(
  req: Request,
  action: string,
  resource: string,
  entityType?: string,
  entityId?: string,
  metadata?: string
): Promise<void> {
  try {
    const userEmail = req.user?.email || "anonymous@consensus.dev";
    const userRole = req.user?.role || "system";
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    // Clean sensitive data from metadata
    let safeMetadata = metadata ? String(metadata) : undefined;
    if (safeMetadata && (safeMetadata.includes("password") || safeMetadata.includes("token"))) {
      safeMetadata = "[Redacted security credentials]";
    }

    await prisma.auditLog.create({
      data: {
        userEmail,
        userRole,
        action,
        resource,
        entityType,
        entityId,
        metadata: safeMetadata ? safeMetadata.slice(0, 500) : undefined,
        ipAddress: String(ipAddress).slice(0, 50),
      },
    });
  } catch (err) {
    console.error("Failed to persist audit log:", err);
  }
}
