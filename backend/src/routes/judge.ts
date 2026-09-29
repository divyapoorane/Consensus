import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /judge/stats
router.get("/stats", authenticate, requireRole("judge", "admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const judgeId = req.user!.id;
    const [assignedHacks, assignedProjs, completedEvals, allEvals] = await Promise.all([
      prisma.judgeAssignment.groupBy({
        by: ["hackathonId"],
        where: { judgeId },
      }),
      prisma.project.count({
        where: {
          submission: { isNot: null },
        },
      }),
      prisma.evaluation.count({ where: { judgeId } }),
      prisma.evaluation.findMany({
        where: { judgeId },
        select: { totalScore: true },
      }),
    ]);

    const avgScore =
      allEvals.length > 0
        ? Math.round(allEvals.reduce((acc, curr) => acc + curr.totalScore, 0) / allEvals.length)
        : 0;

    res.json({
      assignedHackathons: assignedHacks.length,
      assignedProjects: assignedProjs,
      completedEvaluations: completedEvals,
      pendingEvaluations: Math.max(0, assignedProjs - completedEvals),
      upcomingLiveSessions: 0,
      averageScoreGiven: avgScore,
    });
  } catch (err: any) {
    console.error("Judge stats error:", err);
    res.status(500).json({ error: "Failed to fetch judge stats." });
  }
});

// GET /judge/profile
router.get("/profile", authenticate, requireRole("judge", "admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ error: "Judge not found." });
      return;
    }

    const evalCount = await prisma.evaluation.count({ where: { judgeId: user.id } });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      title: user.title || "",
      organization: user.organization || "",
      bio: user.bio || "",
      expertise: user.skills || [],
      avatarUrl: user.avatarUrl || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      evaluationsCompletedCount: evalCount,
      reliabilityScore: 100,
    });
  } catch (err: any) {
    console.error("Judge profile error:", err);
    res.status(500).json({ error: "Failed to fetch judge profile." });
  }
});

// GET /judge/projects - List projects to evaluate
router.get("/projects", authenticate, requireRole("judge", "admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const judgeId = req.user!.id;

    // Get all projects that have a submission
    const projects = await prisma.project.findMany({
      where: {
        submission: { isNot: null },
      },
      include: {
        hackathon: { select: { id: true, title: true, category: true } },
        team: { select: { name: true } },
        submission: true,
        evaluations: {
          where: { judgeId },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = projects.map((p) => {
      const myEval = p.evaluations[0];
      const evaluationStatus = myEval ? "completed" : "pending";

      return {
        id: p.id,
        title: p.title,
        hackathonId: p.hackathonId,
        hackathonTitle: p.hackathon.title,
        teamName: p.team?.name || "Solo Builder",
        category: p.hackathon.category,
        tagline: p.tagline,
        description: p.description,
        repositoryUrl: p.repositoryUrl,
        demoUrl: p.demoUrl,
        videoUrl: p.videoUrl || undefined,
        documentationUrl: p.documentationUrl || undefined,
        techStack: p.techStack,
        submittedAt: p.submission?.submittedAt.toISOString() || p.updatedAt.toISOString(),
        evaluationStatus,
        assignedAt: p.createdAt.toISOString(),
        totalScore: myEval ? myEval.totalScore : undefined,
        myScore: myEval
          ? {
              innovation: myEval.innovation,
              technicalQuality: myEval.technicalQuality,
              uiUx: myEval.uiUx,
              impact: myEval.impact,
              presentation: myEval.presentation,
              feedback: myEval.feedback,
              privateNotes: myEval.privateNotes || undefined,
              recommendForAward: myEval.recommendForAward,
            }
          : undefined,
      };
    });

    res.json(formatted);
  } catch (err: any) {
    console.error("Judge projects error:", err);
    res.status(500).json({ error: "Failed to fetch judge projects." });
  }
});

// GET /judge/projects/:id - Details of a project for judging
router.get("/projects/:id", authenticate, requireRole("judge", "admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const judgeId = req.user!.id;
    const { id } = req.params;

    const p = await prisma.project.findUnique({
      where: { id },
      include: {
        hackathon: { select: { id: true, title: true, category: true } },
        team: { select: { name: true } },
        submission: true,
        evaluations: {
          where: { judgeId },
        },
      },
    });

    if (!p) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    const myEval = p.evaluations[0];
    const evaluationStatus = myEval ? "completed" : "pending";

    res.json({
      id: p.id,
      title: p.title,
      hackathonId: p.hackathonId,
      hackathonTitle: p.hackathon.title,
      teamName: p.team?.name || "Solo Builder",
      category: p.hackathon.category,
      tagline: p.tagline,
      description: p.description,
      repositoryUrl: p.repositoryUrl,
      demoUrl: p.demoUrl,
      videoUrl: p.videoUrl || undefined,
      documentationUrl: p.documentationUrl || undefined,
      techStack: p.techStack,
      submittedAt: p.submission?.submittedAt.toISOString() || p.updatedAt.toISOString(),
      evaluationStatus,
      assignedAt: p.createdAt.toISOString(),
      totalScore: myEval ? myEval.totalScore : undefined,
      myScore: myEval
        ? {
            innovation: myEval.innovation,
            technicalQuality: myEval.technicalQuality,
            uiUx: myEval.uiUx,
            impact: myEval.impact,
            presentation: myEval.presentation,
            feedback: myEval.feedback,
            privateNotes: myEval.privateNotes || undefined,
            recommendForAward: myEval.recommendForAward,
          }
        : undefined,
    });
  } catch (err: any) {
    console.error("Get judge project error:", err);
    res.status(500).json({ error: "Failed to fetch project details." });
  }
});

// POST /judge/projects/:id/evaluate - Submit evaluation
router.post("/projects/:id/evaluate", authenticate, requireRole("judge", "admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const judgeId = req.user!.id;
    const projectId = req.params.id;
    const {
      innovation = 0,
      technicalQuality = 0,
      uiUx = 0,
      impact = 0,
      presentation = 0,
      feedback = "",
      privateNotes = "",
      recommendForAward = false,
    } = req.body;

    const totalScore = Number(innovation) + Number(technicalQuality) + Number(uiUx) + Number(impact) + Number(presentation);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { submission: true },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    // Upsert Evaluation
    const evaluation = await prisma.evaluation.upsert({
      where: {
        judgeId_projectId: { judgeId, projectId },
      },
      create: {
        judgeId,
        projectId,
        submissionId: project.submission?.id || null,
        innovation: Number(innovation),
        technicalQuality: Number(technicalQuality),
        uiUx: Number(uiUx),
        impact: Number(impact),
        presentation: Number(presentation),
        totalScore,
        feedback,
        privateNotes,
        recommendForAward: Boolean(recommendForAward),
      },
      update: {
        innovation: Number(innovation),
        technicalQuality: Number(technicalQuality),
        uiUx: Number(uiUx),
        impact: Number(impact),
        presentation: Number(presentation),
        totalScore,
        feedback,
        privateNotes,
        recommendForAward: Boolean(recommendForAward),
        evaluatedAt: new Date(),
      },
    });

    // Update Submission if exists
    if (project.submission) {
      await prisma.submission.update({
        where: { id: project.submission.id },
        data: {
          status: "evaluated",
          judgingStatus: "Scoring Completed",
          score: totalScore,
          feedback,
        },
      });
    }

    // Update or create JudgeAssignment
    await prisma.judgeAssignment.upsert({
      where: {
        judgeId_hackathonId_projectId: {
          judgeId,
          hackathonId: project.hackathonId,
          projectId: project.id,
        },
      },
      create: {
        judgeId,
        hackathonId: project.hackathonId,
        projectId: project.id,
        status: "completed",
      },
      update: {
        status: "completed",
      },
    });

    await logAudit(
      req,
      "JURY_EVALUATION_COMMITTED",
      project.title,
      "Evaluation",
      evaluation.id,
      `Juror score ${totalScore}/100 recorded for ${project.title}`
    );

    res.json({
      success: true,
      evaluation,
      totalScore,
    });
  } catch (err: any) {
    console.error("Evaluation submit error:", err);
    res.status(500).json({ error: "Failed to submit evaluation." });
  }
});

// GET /judge/evaluations - Evaluation history
router.get("/evaluations", authenticate, requireRole("judge", "admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const judgeId = req.user!.id;
    const evals = await prisma.evaluation.findMany({
      where: { judgeId },
      include: {
        project: {
          include: {
            hackathon: { select: { title: true, category: true } },
            team: { select: { name: true } },
          },
        },
      },
      orderBy: { evaluatedAt: "desc" },
    });

    const formatted = evals.map((e) => ({
      id: e.id,
      projectId: e.projectId,
      projectTitle: e.project.title,
      hackathonTitle: e.project.hackathon.title,
      teamName: e.project.team?.name || "Solo Builder",
      category: e.project.hackathon.category,
      submittedScore: e.totalScore,
      maxScore: 100,
      evaluatedAt: e.evaluatedAt.toISOString(),
      status: "finalized",
      feedbackExcerpt: e.feedback.slice(0, 120) + (e.feedback.length > 120 ? "..." : ""),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Judge evaluations error:", err);
    res.status(500).json({ error: "Failed to fetch evaluations." });
  }
});

export default router;
