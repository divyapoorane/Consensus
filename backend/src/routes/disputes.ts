import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /api/disputes - List disputes
router.get("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role.toLowerCase();
    let where = {};

    if (userRole !== "admin") {
      // Non-admins see disputes filed by themselves
      where = { complainantEmail: req.user!.email };
    }

    const disputes = await prisma.dispute.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = disputes.map((d) => ({
      id: d.id,
      disputeId: d.disputeId,
      complainantName: d.complainantName,
      complainantEmail: d.complainantEmail,
      complainantRole: d.complainantRole as any,
      hackathonTitle: d.hackathonTitle,
      hackathonId: d.hackathonId || undefined,
      projectId: d.projectId || undefined,
      projectTitle: d.projectTitle || undefined,
      category: d.category as any,
      priority: d.priority as any,
      status: d.status.toLowerCase() as any,
      rawStatus: d.status,
      description: d.description,
      resolutionNotes: d.resolutionNotes || undefined,
      createdAt: d.createdAt.toISOString().slice(0, 10),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Get disputes error:", err);
    res.status(500).json({ error: "Failed to fetch disputes." });
  }
});

// POST /api/disputes - Create new dispute ticket
router.post("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      category = "Plagiarism / Code Theft",
      hackathonId,
      hackathonTitle,
      projectId,
      projectTitle,
      priority = "medium",
    } = req.body;

    if (!description) {
      res.status(400).json({ error: "Dispute description is required." });
      return;
    }

    let resolvedHackTitle = hackathonTitle || "Autonomous Systems & AI Arena";
    if (hackathonId && !hackathonTitle) {
      const h = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
      if (h) resolvedHackTitle = h.title;
    }

    const count = await prisma.dispute.count();
    const disputeId = `DSP-${String(4090 + count + 1)}`;

    const dispute = await prisma.dispute.create({
      data: {
        disputeId,
        complainantName: req.user!.name || "Builder",
        complainantEmail: req.user!.email,
        complainantRole: req.user!.role,
        hackathonId,
        hackathonTitle: resolvedHackTitle,
        projectId,
        projectTitle: projectTitle || title,
        category,
        priority: priority.toLowerCase(),
        status: "OPEN",
        description: title ? `${title}: ${description}` : description,
      },
    });

    await logAudit(
      req,
      "DISPUTE_FILED",
      `Ticket #${dispute.disputeId} (${dispute.category})`,
      "Dispute",
      dispute.id,
      `Complainant: ${dispute.complainantEmail} on ${dispute.hackathonTitle}`
    );

    res.status(201).json({
      id: dispute.id,
      disputeId: dispute.disputeId,
      complainantName: dispute.complainantName,
      complainantEmail: dispute.complainantEmail,
      complainantRole: dispute.complainantRole as any,
      hackathonTitle: dispute.hackathonTitle,
      category: dispute.category as any,
      priority: dispute.priority as any,
      status: "open",
      rawStatus: "OPEN",
      description: dispute.description,
      createdAt: dispute.createdAt.toISOString().slice(0, 10),
    });
  } catch (err: any) {
    console.error("Create dispute error:", err);
    res.status(500).json({ error: "Failed to submit dispute." });
  }
});

// POST /api/disputes/:id/resolve - Admin update dispute status & resolution notes
router.post(
  "/:id/resolve",
  authenticate,
  requireRole("admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, resolutionNotes } = req.body;

      const dispute = await prisma.dispute.findFirst({
        where: {
          OR: [{ id }, { disputeId: id }],
        },
      });

      if (!dispute) {
        res.status(404).json({ error: "Dispute not found." });
        return;
      }

      const normalizedStatus = String(status).toUpperCase();
      const updated = await prisma.dispute.update({
        where: { id: dispute.id },
        data: {
          status: normalizedStatus,
          resolutionNotes: resolutionNotes || "Reviewed and determined by consensus administrative panel.",
        },
      });

      await logAudit(
        req,
        "DISPUTE_RESOLVED",
        `Ticket #${updated.disputeId} marked as ${normalizedStatus}`,
        "Dispute",
        updated.id,
        updated.resolutionNotes || undefined
      );

      res.json({
        id: updated.id,
        disputeId: updated.disputeId,
        complainantName: updated.complainantName,
        complainantEmail: updated.complainantEmail,
        complainantRole: updated.complainantRole as any,
        hackathonTitle: updated.hackathonTitle,
        category: updated.category as any,
        priority: updated.priority as any,
        status: updated.status.toLowerCase() as any,
        rawStatus: updated.status,
        description: updated.description,
        resolutionNotes: updated.resolutionNotes || undefined,
        createdAt: updated.createdAt.toISOString().slice(0, 10),
      });
    } catch (err: any) {
      console.error("Resolve dispute error:", err);
      res.status(500).json({ error: "Failed to update dispute status." });
    }
  }
);

export default router;
