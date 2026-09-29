import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { authenticate } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /participant/profile
router.get("/profile", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const [firstName, ...rest] = (user.name || "").split(" ");
    const lastName = rest.join(" ") || "";

    res.json({
      id: user.id,
      avatarUrl: user.avatarUrl || "",
      firstName,
      lastName,
      username: user.email.split("@")[0],
      email: user.email,
      phone: "",
      bio: user.bio || "",
      college: user.college || "",
      course: user.course || "",
      graduationYear: user.graduationYear || "",
      currentRole: user.currentRole || "",
      skills: user.skills || [],
      interests: user.interests || [],
      github: user.github || "",
      linkedin: user.linkedin || "",
      portfolio: user.portfolio || "",
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
    });
  } catch (err: any) {
    console.error("Profile get error:", err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// PUT /participant/profile
router.put("/profile", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const name = [body.firstName, body.lastName].filter(Boolean).join(" ");

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: name || undefined,
        bio: body.bio,
        college: body.college,
        course: body.course,
        graduationYear: body.graduationYear,
        currentRole: body.currentRole,
        skills: body.skills,
        interests: body.interests,
        github: body.github,
        linkedin: body.linkedin,
        portfolio: body.portfolio,
        country: body.country,
        state: body.state,
        city: body.city,
      },
    });

    res.json(updated);
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

// GET /participant/stats
router.get("/stats", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const [registrationsCount, teamsCount, projectsCount, submissionsCount, user] = await Promise.all([
      prisma.registration.count({ where: { userId } }),
      prisma.teamMember.count({ where: { userId } }),
      prisma.project.count({ where: { creatorId: userId } }),
      prisma.submission.count({ where: { submitterId: userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { bio: true, college: true, skills: true, github: true, linkedin: true },
      }),
    ]);

    const fields = [user?.bio, user?.college, user?.skills?.length ? true : null, user?.github, user?.linkedin];
    const completed = fields.filter(Boolean).length;
    const profileCompletion = Math.round((completed / fields.length) * 100);

    res.json({
      hackathonsJoined: registrationsCount,
      activeTeams: teamsCount,
      projectsBuilt: projectsCount,
      submissionsCount: submissionsCount,
      profileCompletion,
    });
  } catch (err: any) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch participant stats." });
  }
});

// GET /participant/hackathons - Enrolled hackathons
router.get("/hackathons", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        hackathon: {
          include: {
            teams: {
              where: {
                members: {
                  some: { userId },
                },
              },
              select: { name: true },
            },
            submissions: {
              where: { submitterId: userId },
              select: { status: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const list = registrations.map((r) => {
      const h = r.hackathon;
      const myTeam = h.teams[0]?.name;
      const mySub = h.submissions[0];

      return {
        id: h.id,
        title: h.title,
        category: h.category,
        bannerUrl: h.bannerUrl,
        status: h.status === "completed" ? "completed" : "active",
        registrationStatus: r.status,
        submissionStatus: mySub ? "submitted" : "not_started",
        startDate: h.hackathonStart,
        endDate: h.hackathonEnd,
        submissionDeadline: h.submissionDeadline,
        teamName: myTeam || "Solo Builder",
        prizePool: h.totalPrizePool,
      };
    });

    res.json(list);
  } catch (err: any) {
    console.error("Participant hackathons error:", err);
    res.status(500).json({ error: "Failed to fetch enrolled hackathons." });
  }
});

// POST /participant/hackathons/:id/register
router.post("/hackathons/:id/register", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const hackathonId = req.params.id;
    const userId = req.user!.id;

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      res.status(404).json({ error: "Hackathon not found." });
      return;
    }

    const existing = await prisma.registration.findUnique({
      where: {
        hackathonId_userId: { hackathonId, userId },
      },
    });

    if (existing) {
      res.json({ message: "Already registered", registration: existing });
      return;
    }

    const reg = await prisma.registration.create({
      data: {
        hackathonId,
        userId,
        status: "confirmed",
      },
    });

    await logAudit(
      req,
      "PARTICIPANT_REGISTERED",
      hackathon.title,
      "Registration",
      reg.id,
      `${req.user!.email} registered for ${hackathon.title}`
    );

    res.status(201).json({ message: "Registration successful", registration: reg });
  } catch (err: any) {
    console.error("Register hackathon error:", err);
    res.status(500).json({ error: "Failed to register for hackathon." });
  }
});

// GET /participant/teams
router.get("/teams", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const teamMemberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            hackathon: { select: { title: true } },
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true },
                },
              },
            },
            projects: { select: { title: true } },
          },
        },
      },
    });

    const result = teamMemberships.map((tm) => {
      const t = tm.team;
      const isLeader = t.leaderId === userId;
      return {
        id: t.id,
        name: t.name,
        hackathonId: t.hackathonId,
        hackathonTitle: t.hackathon.title,
        inviteCode: t.inviteCode,
        myRole: isLeader ? "Team Leader" : "Member",
        maxMembers: t.maxMembers,
        projectTitle: t.projects[0]?.title || undefined,
        members: t.members.map((m) => ({
          id: m.user.id,
          name: m.user.id === userId ? `${m.user.name} (You)` : m.user.name,
          email: m.user.email,
          role: m.role,
          avatarUrl: m.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          isLeader: t.leaderId === m.user.id,
        })),
      };
    });

    res.json(result);
  } catch (err: any) {
    console.error("Get teams error:", err);
    res.status(500).json({ error: "Failed to fetch teams." });
  }
});

// POST /participant/teams - Create team
router.post("/teams", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, hackathonId, hackathonTitle } = req.body;

    if (!name) {
      res.status(400).json({ error: "Team name is required." });
      return;
    }

    // Find hackathon, default to first active hackathon if not specified
    let targetHackathonId = hackathonId;
    if (!targetHackathonId || targetHackathonId === "hack-01") {
      const firstHack = await prisma.hackathon.findFirst({ where: { status: "active" } });
      if (firstHack) targetHackathonId = firstHack.id;
    }

    const inviteCode = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const team = await prisma.team.create({
      data: {
        name,
        hackathonId: targetHackathonId,
        leaderId: userId,
        inviteCode,
        maxMembers: 4,
        members: {
          create: {
            userId,
            role: "Team Lead",
          },
        },
      },
      include: {
        hackathon: { select: { title: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
      },
    });

    // Also auto-register user for hackathon if not already registered
    await prisma.registration.upsert({
      where: { hackathonId_userId: { hackathonId: targetHackathonId, userId } },
      create: { hackathonId: targetHackathonId, userId, status: "confirmed" },
      update: {},
    });

    const formatted = {
      id: team.id,
      name: team.name,
      hackathonId: team.hackathonId,
      hackathonTitle: team.hackathon.title,
      inviteCode: team.inviteCode,
      myRole: "Team Leader",
      maxMembers: team.maxMembers,
      members: team.members.map((m) => ({
        id: m.user.id,
        name: `${m.user.name} (You)`,
        email: m.user.email,
        role: m.role,
        avatarUrl: m.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        isLeader: true,
      })),
    };

    await logAudit(
      req,
      "TEAM_CREATED",
      `${team.name} (Code: ${team.inviteCode})`,
      "Team",
      team.id,
      `Squad formed for ${team.hackathon.title}`
    );

    res.status(201).json(formatted);
  } catch (err: any) {
    console.error("Create team error:", err);
    res.status(500).json({ error: "Failed to create team." });
  }
});

// POST /participant/teams/join - Join team
router.post("/teams/join", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { inviteCode } = req.body;

    if (!inviteCode) {
      res.status(400).json({ error: "Invite code is required." });
      return;
    }

    const team = await prisma.team.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
      include: {
        hackathon: { select: { title: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: "Invalid team invite code." });
      return;
    }

    // Check if already in team
    const alreadyMember = team.members.some((m) => m.userId === userId);
    if (!alreadyMember) {
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: "Full Stack Member",
        },
      });
      // Register for hackathon
      await prisma.registration.upsert({
        where: { hackathonId_userId: { hackathonId: team.hackathonId, userId } },
        create: { hackathonId: team.hackathonId, userId, status: "confirmed" },
        update: {},
      });
    }

    // Refetch updated team
    const updated = await prisma.team.findUnique({
      where: { id: team.id },
      include: {
        hackathon: { select: { title: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
      },
    });

    const isLeader = updated!.leaderId === userId;
    res.json({
      id: updated!.id,
      name: updated!.name,
      hackathonId: updated!.hackathonId,
      hackathonTitle: updated!.hackathon.title,
      inviteCode: updated!.inviteCode,
      myRole: isLeader ? "Team Leader" : "Member",
      maxMembers: updated!.maxMembers,
      members: updated!.members.map((m) => ({
        id: m.user.id,
        name: m.user.id === userId ? `${m.user.name} (You)` : m.user.name,
        email: m.user.email,
        role: m.role,
        avatarUrl: m.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        isLeader: updated!.leaderId === m.user.id,
      })),
    });
  } catch (err: any) {
    console.error("Join team error:", err);
    res.status(500).json({ error: "Failed to join team." });
  }
});

// GET /participant/projects
router.get("/projects", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: userId },
          {
            team: {
              members: {
                some: { userId },
              },
            },
          },
        ],
      },
      include: {
        hackathon: { select: { title: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      hackathonId: p.hackathonId,
      hackathonTitle: p.hackathon.title,
      title: p.title,
      tagline: p.tagline,
      description: p.description,
      techStack: p.techStack,
      repositoryUrl: p.repositoryUrl,
      demoUrl: p.demoUrl,
      documentationUrl: p.documentationUrl || "",
      status: p.status,
      updatedAt: p.updatedAt.toISOString(),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Get projects error:", err);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// POST /participant/projects - Create project
router.post("/projects", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      title,
      tagline,
      description,
      techStack,
      repositoryUrl,
      demoUrl,
      documentationUrl,
      hackathonId,
    } = req.body;

    let targetHackathonId = hackathonId;
    if (!targetHackathonId || targetHackathonId === "hack-01") {
      const firstHack = await prisma.hackathon.findFirst({ where: { status: "active" } });
      if (firstHack) targetHackathonId = firstHack.id;
    }

    // Find any team user is on for this hackathon
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        team: { hackathonId: targetHackathonId },
      },
    });

    const project = await prisma.project.create({
      data: {
        title,
        tagline: tagline || "Prototypes and systems.",
        description: description || "Project description.",
        techStack: Array.isArray(techStack) ? techStack : [],
        repositoryUrl: repositoryUrl || "https://github.com",
        demoUrl: demoUrl || "https://demo.consensus.dev",
        documentationUrl: documentationUrl || null,
        status: "Ready for Submission",
        hackathonId: targetHackathonId,
        teamId: teamMember?.teamId || null,
        creatorId: userId,
      },
      include: {
        hackathon: { select: { title: true } },
      },
    });

    res.status(201).json({
      id: project.id,
      hackathonId: project.hackathonId,
      hackathonTitle: project.hackathon.title,
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      techStack: project.techStack,
      repositoryUrl: project.repositoryUrl,
      demoUrl: project.demoUrl,
      documentationUrl: project.documentationUrl || "",
      status: project.status,
      updatedAt: project.updatedAt.toISOString(),
    });

    await logAudit(
      req,
      "PROJECT_CREATED",
      project.title,
      "Project",
      project.id,
      `Workspace initialized for ${project.hackathon.title}`
    );
  } catch (err: any) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Failed to create project." });
  }
});

// GET /participant/submissions
router.get("/submissions", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const submissions = await prisma.submission.findMany({
      where: {
        OR: [
          { submitterId: userId },
          {
            team: {
              members: {
                some: { userId },
              },
            },
          },
        ],
      },
      include: {
        project: { select: { title: true } },
        hackathon: { select: { title: true } },
        team: { select: { name: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    const formatted = submissions.map((s) => ({
      id: s.id,
      projectId: s.projectId,
      projectTitle: s.project.title,
      hackathonId: s.hackathonId,
      hackathonTitle: s.hackathon.title,
      teamName: s.team?.name || "Solo Builder",
      status: s.status,
      validationStatus: s.validationStatus,
      judgingStatus: s.judgingStatus,
      score: s.score || undefined,
      maxScore: s.maxScore,
      feedback: s.feedback || undefined,
      submittedAt: s.submittedAt.toISOString(),
      timeline: [
        { label: "Submitted", date: s.submittedAt.toISOString().slice(0, 10), completed: true },
        { label: "Validation Gate", date: "Instant Automated Verification", completed: true },
        { label: "Jury Deliberation", date: "Double-Blind Scoring", completed: s.status === "evaluated" },
      ],
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Get submissions error:", err);
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

// POST /participant/submissions - Submit project
router.post("/submissions", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { projectId } = req.body;

    if (!projectId) {
      res.status(400).json({ error: "Project ID is required to submit." });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { hackathon: true, team: true },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    // Ownership check: user must be project creator, team member, or admin
    const isCreator = project.creatorId === userId;
    let isTeamMember = false;
    if (project.teamId) {
      const tm = await prisma.teamMember.findFirst({
        where: { teamId: project.teamId, userId },
      });
      if (tm) isTeamMember = true;
    }

    if (!isCreator && !isTeamMember && req.user!.role !== "admin") {
      res.status(403).json({ error: "Access denied. You do not have permission to submit this project." });
      return;
    }

    // Update project status to Submitted
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "Submitted" },
    });

    // Create or update submission
    const submission = await prisma.submission.upsert({
      where: { projectId },
      create: {
        projectId,
        hackathonId: project.hackathonId,
        teamId: project.teamId,
        submitterId: userId,
        status: "submitted",
        validationStatus: "Passed",
        judgingStatus: "Pending Review",
        submittedAt: new Date(),
      },
      update: {
        status: "submitted",
        validationStatus: "Passed",
        judgingStatus: "Pending Review",
        submittedAt: new Date(),
      },
      include: {
        project: { select: { title: true } },
        hackathon: { select: { title: true } },
        team: { select: { name: true } },
      },
    });

    // Auto-assign any active judge to this project if none assigned yet
    const anyJudge = await prisma.user.findFirst({ where: { role: "judge" } });
    if (anyJudge) {
      await prisma.judgeAssignment.upsert({
        where: {
          judgeId_hackathonId_projectId: {
            judgeId: anyJudge.id,
            hackathonId: project.hackathonId,
            projectId: project.id,
          },
        },
        create: {
          judgeId: anyJudge.id,
          hackathonId: project.hackathonId,
          projectId: project.id,
          status: "pending",
        },
        update: {},
      });
    }

    await logAudit(
      req,
      "PROJECT_SUBMITTED",
      submission.project.title,
      "Submission",
      submission.id,
      `Submitted by ${req.user!.email} to ${submission.hackathon.title}`
    );

    res.status(201).json({
      id: submission.id,
      projectId: submission.projectId,
      projectTitle: submission.project.title,
      hackathonId: submission.hackathonId,
      hackathonTitle: submission.hackathon.title,
      teamName: submission.team?.name || "Solo Builder",
      status: submission.status,
      validationStatus: submission.validationStatus,
      judgingStatus: submission.judgingStatus,
      submittedAt: submission.submittedAt.toISOString(),
      timeline: [
        { label: "Submitted", date: submission.submittedAt.toISOString().slice(0, 10), completed: true },
        { label: "Validation Gate", date: "Instant Automated Verification", completed: true },
        { label: "Jury Deliberation", date: "Double-Blind Scoring", completed: false },
      ],
    });
  } catch (err: any) {
    console.error("Submit project error:", err);
    res.status(500).json({ error: "Failed to submit project." });
  }
});

export default router;
