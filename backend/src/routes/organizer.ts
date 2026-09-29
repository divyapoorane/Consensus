import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /organizer/stats
router.get("/stats", authenticate, requireRole("organizer", "admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalHacks, activeHacks, totalRegs, totalSubs, completedHacks] = await Promise.all([
      prisma.hackathon.count(),
      prisma.hackathon.count({ where: { status: "active" } }),
      prisma.registration.count(),
      prisma.submission.count(),
      prisma.hackathon.count({ where: { status: "completed" } }),
    ]);

    const pendingJudging = await prisma.submission.count({
      where: { status: "submitted" },
    });

    const completedPayouts = await prisma.payout.findMany({
      where: { status: "completed" },
    });
    const totalPayoutSum = completedPayouts.reduce((acc, curr) => {
      return acc + (parseInt(curr.amount.replace(/[^0-9]/g, ""), 10) || 0);
    }, 0);

    res.json({
      totalHackathons: totalHacks,
      activeHackathons: activeHacks,
      totalRegistrations: totalRegs,
      totalSubmissions: totalSubs,
      pendingJudging,
      completedEvents: completedHacks,
      totalPrizeDistributed: `$${totalPayoutSum.toLocaleString()}`,
    });
  } catch (err: any) {
    console.error("Organizer stats error:", err);
    res.status(500).json({ error: "Failed to fetch organizer stats." });
  }
});

// GET /organizer/participants
router.get("/participants", authenticate, requireRole("organizer", "admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        user: true,
        hackathon: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Also look up team and submission for each
    const list = await Promise.all(
      registrations.map(async (r) => {
        const teamMember = await prisma.teamMember.findFirst({
          where: {
            userId: r.userId,
            team: { hackathonId: r.hackathonId },
          },
          include: { team: true },
        });

        const submission = await prisma.submission.findFirst({
          where: {
            submitterId: r.userId,
            hackathonId: r.hackathonId,
          },
        });

        return {
          id: r.id,
          name: r.user.name,
          email: r.user.email,
          hackathonId: r.hackathonId,
          hackathonTitle: r.hackathon.title,
          teamName: teamMember?.team.name || "Solo Builder",
          registrationStatus: r.status as any,
          submissionStatus: submission ? "submitted" : "in_progress",
          dateJoined: r.createdAt.toISOString().slice(0, 10),
          country: r.user.country || "",
          skills: r.user.skills || [],
        };
      })
    );

    res.json(list);
  } catch (err: any) {
    console.error("Organizer participants error:", err);
    res.status(500).json({ error: "Failed to fetch participants." });
  }
});

// GET /organizer/teams
router.get("/teams", authenticate, requireRole("organizer", "admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        hackathon: { select: { title: true } },
        leader: { select: { name: true, email: true } },
        members: true,
        projects: {
          include: {
            submission: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = teams.map((t) => {
      const proj = t.projects[0];
      const hasSub = proj?.submission !== null && proj?.submission !== undefined;
      return {
        id: t.id,
        name: t.name,
        hackathonId: t.hackathonId,
        hackathonTitle: t.hackathon.title,
        leaderName: t.leader.name,
        leaderEmail: t.leader.email,
        memberCount: t.members.length,
        maxMembers: t.maxMembers,
        submissionTitle: proj?.title || undefined,
        submissionStatus: hasSub ? "submitted" : "not_submitted",
        createdAt: t.createdAt.toISOString().slice(0, 10),
      };
    });

    res.json(formatted);
  } catch (err: any) {
    console.error("Organizer teams error:", err);
    res.status(500).json({ error: "Failed to fetch organizer teams." });
  }
});

// GET /organizer/submissions
router.get("/submissions", authenticate, requireRole("organizer", "admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        project: true,
        hackathon: { select: { title: true } },
        team: { select: { name: true } },
        evaluations: {
          include: {
            judge: { select: { name: true } },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    const formatted = submissions.map((s) => ({
      id: s.id,
      projectTitle: s.project.title,
      hackathonId: s.hackathonId,
      hackathonTitle: s.hackathon.title,
      teamName: s.team?.name || "Solo Builder",
      techStack: s.project.techStack,
      submittedAt: s.submittedAt.toISOString(),
      assignedJudges: s.evaluations.map((e) => e.judge.name),
      status: s.status as any,
      averageScore: s.score || undefined,
      consensusScore: s.score || undefined,
      demoUrl: s.project.demoUrl,
      repoUrl: s.project.repositoryUrl,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Organizer submissions error:", err);
    res.status(500).json({ error: "Failed to fetch organizer submissions." });
  }
});

// GET /organizer/judges
router.get("/judges", authenticate, requireRole("organizer", "admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const judges = await prisma.user.findMany({
      where: { role: "judge" },
      include: {
        evaluations: true,
        assignments: {
          include: {
            hackathon: { select: { title: true } },
          },
        },
      },
    });

    const formatted = judges.map((j) => {
      const assigned = j.assignments.length;
      const evaluated = j.evaluations.length;
      const progress = assigned > 0 ? Math.min(100, Math.round((evaluated / assigned) * 100)) : 0;
      const hackathonTitles = Array.from(new Set(j.assignments.map((a) => a.hackathon.title)));

      return {
        id: j.id,
        name: j.name,
        email: j.email,
        title: j.title || "",
        organization: j.organization || "",
        assignedHackathons: hackathonTitles,
        assignedProjectsCount: assigned,
        evaluatedProjectsCount: evaluated,
        evaluationProgress: progress,
        status: (j.status as "active" | "suspended") || ("active" as const),
      };
    });

    res.json(formatted);
  } catch (err: any) {
    console.error("Organizer judges error:", err);
    res.status(500).json({ error: "Failed to fetch judges." });
  }
});

export default router;
