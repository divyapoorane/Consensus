import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /api/payouts - List all demo payouts
router.get("/", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role.toLowerCase();
    let where = {};

    if (userRole === "participant") {
      where = {
        OR: [
          { recipientEmail: req.user!.email },
          { winnerTeam: { contains: "Synapse", mode: "insensitive" } },
        ],
      };
    }

    const payouts = await prisma.payout.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = payouts.map((p) => ({
      id: p.id,
      payoutId: p.payoutId,
      hackathonId: p.hackathonId,
      hackathonTitle: p.hackathonTitle,
      winnerTeam: p.winnerTeam,
      recipientEmail: p.recipientEmail,
      prizeTitle: p.prizeTitle,
      amount: p.amount,
      status: p.status,
      payoutMethod: p.payoutMethod,
      isDemo: p.isDemo,
      initiatedAt: p.initiatedAt.toISOString(),
      completedAt: p.completedAt ? p.completedAt.toISOString() : undefined,
      date: p.initiatedAt.toISOString().slice(0, 10),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Get payouts error:", err);
    res.status(500).json({ error: "Failed to fetch simulated payouts." });
  }
});

// GET /api/payouts/hackathon/:hackathonId - Escrow status for a hackathon
router.get("/hackathon/:hackathonId", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { hackathonId } = req.params;
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { payouts: true },
    });

    if (!hackathon) {
      res.status(404).json({ error: "Hackathon not found." });
      return;
    }

    const totalAllocated = hackathon.totalPrizePool || "$50,000";
    const completedPayouts = hackathon.payouts.filter((p) => p.status === "completed");
    const disbursedSum = completedPayouts.reduce((acc, curr) => {
      const num = parseInt(curr.amount.replace(/[^0-9]/g, ""), 10) || 0;
      return acc + num;
    }, 0);

    res.json({
      hackathonId: hackathon.id,
      hackathonTitle: hackathon.title,
      totalEscrowAllocated: totalAllocated,
      totalDisbursed: `$${disbursedSum.toLocaleString()}`,
      isSimulation: true,
      simulationNotice: "Demo Escrow Balance — Simulated for presentation only.",
      payoutsCount: hackathon.payouts.length,
    });
  } catch (err: any) {
    console.error("Hackathon escrow error:", err);
    res.status(500).json({ error: "Failed to fetch escrow balance." });
  }
});

// POST /api/payouts - Create / Configure new prize payout
router.post(
  "/",
  authenticate,
  requireRole("organizer", "admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { hackathonId, winnerTeam, recipientEmail, prizeTitle, amount, payoutMethod } = req.body;

      if (!winnerTeam || !amount) {
        res.status(400).json({ error: "Winning team and amount are required." });
        return;
      }

      let hackathonTitle = "Autonomous Systems & AI Arena";
      let targetHackId = hackathonId;
      if (hackathonId) {
        const h = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
        if (h) {
          hackathonTitle = h.title;
          targetHackId = h.id;
        }
      } else {
        const first = await prisma.hackathon.findFirst();
        if (first) {
          targetHackId = first.id;
          hackathonTitle = first.title;
        }
      }

      const count = await prisma.payout.count();
      const payoutId = `DEMO-TXN-${String(count + 1).padStart(3, "0")}`;

      const payout = await prisma.payout.create({
        data: {
          payoutId,
          hackathonId: targetHackId,
          hackathonTitle,
          winnerTeam,
          recipientEmail: recipientEmail || "participant@consensus.dev",
          prizeTitle: prizeTitle || "Track Finalist Award",
          amount,
          status: "pending",
          payoutMethod: payoutMethod || "Simulated Escrow Settlement (Demo)",
          isDemo: true,
        },
      });

      await logAudit(
        req,
        "DEMO_PAYOUT_CONFIGURED",
        `${payout.payoutId} — ${payout.amount} to ${payout.winnerTeam}`,
        "Payout",
        payout.id,
        "Simulated prize payout created in escrow ledger."
      );

      res.status(201).json(payout);
    } catch (err: any) {
      console.error("Create payout error:", err);
      res.status(500).json({ error: "Failed to configure payout." });
    }
  }
);

// POST /api/payouts/:id/status - Update payout status
router.post(
  "/:id/status",
  authenticate,
  requireRole("organizer", "admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["pending", "processing", "completed", "failed", "held_for_review"];
      const normalizedStatus = String(status).toLowerCase();

      if (!validStatuses.includes(normalizedStatus)) {
        res.status(400).json({ error: "Invalid payout status." });
        return;
      }

      // Check if ID matches internal ID or payoutId (DEMO-TXN-...)
      const existing = await prisma.payout.findFirst({
        where: {
          OR: [{ id }, { payoutId: id }],
        },
      });

      if (!existing) {
        res.status(404).json({ error: "Payout record not found." });
        return;
      }

      const updated = await prisma.payout.update({
        where: { id: existing.id },
        data: {
          status: normalizedStatus,
          completedAt: normalizedStatus === "completed" ? new Date() : null,
        },
      });

      await logAudit(
        req,
        "DEMO_PAYOUT_STATUS_UPDATED",
        `${updated.payoutId} -> ${normalizedStatus.toUpperCase()}`,
        "Payout",
        updated.id,
        `Simulated settlement status changed to ${normalizedStatus.toUpperCase()}`
      );

      res.json(updated);
    } catch (err: any) {
      console.error("Update payout status error:", err);
      res.status(500).json({ error: "Failed to update payout status." });
    }
  }
);

export default router;
