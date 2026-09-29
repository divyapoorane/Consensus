import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { authenticate, optionalAuthenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /hackathons - Public catalog
router.get("/", optionalAuthenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const where: any = {};
    if (category && category !== "all") {
      where.category = String(category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { tagline: { contains: q, mode: "insensitive" } },
      ];
    }

    const hackathons = await prisma.hackathon.findMany({
      where,
      include: {
        _count: {
          select: {
            registrations: true,
            submissions: true,
            teams: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = hackathons.map((h) => ({
      id: h.id,
      title: h.title,
      name: h.title,
      category: h.category,
      tagline: h.tagline,
      description: h.description,
      bannerUrl: h.bannerUrl,
      logoUrl: h.logoUrl,
      date: `${h.registrationStart} – ${h.hackathonEnd}`,
      participants: `${h._count.registrations} Registered Builders`,
      teamSize: `${h.minTeamSize} – ${h.maxTeamSize} Builders`,
      prizePool: h.totalPrizePool,
      status: h.status === "active" ? "Registration Open" : h.status === "draft" ? "Draft" : "Upcoming",
      rawStatus: h.status,
      tags: [h.category.split(" ")[0] || "General", "Open Track", "Global"],
      registrationsCount: h._count.registrations,
      submissionsCount: h._count.submissions,
      teamsCount: h._count.teams,
      createdAt: h.createdAt.toISOString(),
      schedule: {
        registrationStart: h.registrationStart,
        registrationEnd: h.registrationEnd,
        hackathonStart: h.hackathonStart,
        hackathonEnd: h.hackathonEnd,
        submissionDeadline: h.submissionDeadline,
        judgingPeriod: h.judgingPeriod || "",
        resultsDate: h.resultsDate || "",
      },
      participation: {
        format: h.format,
        minTeamSize: h.minTeamSize,
        maxTeamSize: h.maxTeamSize,
        eligibility: h.eligibility || "Open to all builders.",
        geographicRestrictions: h.geographicRestrictions || "No restrictions",
        requirements: h.requirements,
      },
      prizes: {
        totalPool: h.totalPrizePool,
        tiers: (h.prizeTiers as any) || [],
      },
      judging: {
        rubric: (h.rubric as any) || [],
        requiredJudgesPerProject: 3,
        blindJudging: true,
      },
      communityVoting: { enabled: true },
      presentation: { livePresentationEnabled: true },
      certificates: { participantEnabled: true, winnerEnabled: true, judgeEnabled: true },
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("List hackathons error:", err);
    res.status(500).json({ error: "Failed to list hackathons." });
  }
});

// GET /hackathons/:id - Public details
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const h = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registrations: true,
            submissions: true,
            teams: true,
          },
        },
      },
    });

    if (!h) {
      res.status(404).json({ error: "Hackathon not found." });
      return;
    }

    const formatted = {
      id: h.id,
      title: h.title,
      name: h.title,
      category: h.category,
      tagline: h.tagline,
      description: h.description,
      bannerUrl: h.bannerUrl,
      logoUrl: h.logoUrl,
      date: `${h.registrationStart} – ${h.hackathonEnd}`,
      participants: `${h._count.registrations} Registered Builders`,
      teamSize: `${h.minTeamSize} – ${h.maxTeamSize} Builders`,
      prizePool: h.totalPrizePool,
      status: h.status === "active" ? "Registration Open" : h.status === "draft" ? "Draft" : "Upcoming",
      rawStatus: h.status,
      tags: [h.category.split(" ")[0] || "General", "Open Track", "Global"],
      registrationsCount: h._count.registrations,
      submissionsCount: h._count.submissions,
      createdAt: h.createdAt.toISOString(),
      schedule: {
        registrationStart: h.registrationStart,
        registrationEnd: h.registrationEnd,
        hackathonStart: h.hackathonStart,
        hackathonEnd: h.hackathonEnd,
        submissionDeadline: h.submissionDeadline,
        judgingPeriod: h.judgingPeriod || "",
        resultsDate: h.resultsDate || "",
      },
      participation: {
        format: h.format,
        minTeamSize: h.minTeamSize,
        maxTeamSize: h.maxTeamSize,
        eligibility: h.eligibility || "Open to all builders.",
        geographicRestrictions: h.geographicRestrictions || "No restrictions",
        requirements: h.requirements,
      },
      prizes: {
        totalPool: h.totalPrizePool,
        tiers: (h.prizeTiers as any) || [],
      },
      judging: {
        rubric: (h.rubric as any) || [],
        requiredJudgesPerProject: 3,
        blindJudging: true,
      },
      communityVoting: { enabled: true },
      presentation: { livePresentationEnabled: true },
      certificates: { participantEnabled: true, winnerEnabled: true, judgeEnabled: true },
    };

    res.json(formatted);
  } catch (err: any) {
    console.error("Get hackathon error:", err);
    res.status(500).json({ error: "Failed to fetch hackathon details." });
  }
});

// POST /hackathons - Organizer/Admin create hackathon
router.post(
  "/",
  authenticate,
  requireRole("organizer", "admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const title = data.name || data.title || "Untitled Hackathon";
      const tagline = data.tagline || "Innovate and build.";
      const description = data.description || "Hackathon description.";
      const category = data.category || "Autonomous Systems & AI";
      const bannerUrl = data.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800";
      const logoUrl = data.logoUrl || null;
      const status = data.status || "active";

      const schedule = data.schedule || {};
      const participation = data.participation || {};
      const prizes = data.prizes || {};
      const judging = data.judging || {};

      const hackathon = await prisma.hackathon.create({
        data: {
          title,
          tagline,
          description,
          category,
          bannerUrl,
          logoUrl,
          status,
          registrationStart: schedule.registrationStart || new Date().toISOString().split("T")[0],
          registrationEnd: schedule.registrationEnd || "2026-11-01",
          hackathonStart: schedule.hackathonStart || "2026-11-02",
          hackathonEnd: schedule.hackathonEnd || "2026-11-15",
          submissionDeadline: schedule.submissionDeadline || "2026-11-14T23:59:00Z",
          judgingPeriod: schedule.judgingPeriod || "Nov 15 - Nov 18, 2026",
          resultsDate: schedule.resultsDate || "2026-11-19",
          format: participation.format || "team",
          minTeamSize: participation.minTeamSize || 1,
          maxTeamSize: participation.maxTeamSize || 4,
          eligibility: participation.eligibility || "Open to all.",
          geographicRestrictions: participation.geographicRestrictions || "Global",
          requirements: participation.requirements || ["Public GitHub repo", "Live demo link"],
          totalPrizePool: prizes.totalPool || "$50,000",
          prizeTiers: prizes.tiers || [],
          rubric: judging.rubric || [],
          organizerId: req.user!.id,
          organizerName: req.user!.name,
          organizerEmail: req.user!.email,
        },
      });

      await logAudit(
        req,
        "HACKATHON_CREATED",
        hackathon.title,
        "Hackathon",
        hackathon.id,
        `Track deployed with prize pool ${hackathon.totalPrizePool}`
      );

      res.status(201).json(hackathon);
    } catch (err: any) {
      console.error("Create hackathon error:", err);
      res.status(500).json({ error: "Failed to create hackathon." });
    }
  }
);

// PUT /hackathons/:id - Organizer/Admin update hackathon
router.put(
  "/:id",
  authenticate,
  requireRole("organizer", "admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const existing = await prisma.hackathon.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ error: "Hackathon not found." });
        return;
      }

      if (req.user!.role !== "admin" && existing.organizerId !== req.user!.id) {
        res.status(403).json({ error: "Access denied. You can only modify hackathons you organized." });
        return;
      }

      const hackathon = await prisma.hackathon.update({
        where: { id },
        data: {
          title: updates.title || updates.name,
          tagline: updates.tagline,
          description: updates.description,
          category: updates.category,
          bannerUrl: updates.bannerUrl,
          status: updates.status,
          totalPrizePool: updates.totalPrizePool || updates.prizes?.totalPool,
        },
      });

      res.json(hackathon);
    } catch (err: any) {
      console.error("Update hackathon error:", err);
      res.status(500).json({ error: "Failed to update hackathon." });
    }
  }
);

export default router;
