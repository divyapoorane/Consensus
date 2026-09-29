import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /admin/kpis
router.get("/kpis", authenticate, requireRole("admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalParticipants,
      totalOrganizers,
      totalJudges,
      activeHackathons,
      pendingApprovals,
      totalSubmissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "participant" } }),
      prisma.user.count({ where: { role: "organizer" } }),
      prisma.user.count({ where: { role: "judge" } }),
      prisma.hackathon.count({ where: { status: "active" } }),
      prisma.hackathon.count({ where: { status: "draft" } }),
      prisma.submission.count(),
    ]);

    const completedPayouts = await prisma.payout.findMany({
      where: { status: "completed" },
    });
    const totalPayoutSum = completedPayouts.reduce((acc, curr) => {
      return acc + (parseInt(curr.amount.replace(/[^0-9]/g, ""), 10) || 0);
    }, 0);

    res.json({
      totalUsers,
      totalParticipants,
      totalOrganizers,
      totalJudges,
      activeHackathons,
      pendingApprovals,
      totalSubmissions,
      totalPaymentVolume: "$0",
      totalPayoutVolume: `$${totalPayoutSum.toLocaleString()}`,
      systemHealth: "optimal",
    });
  } catch (err: any) {
    console.error("Admin KPIs error:", err);
    res.status(500).json({ error: "Failed to fetch admin KPIs." });
  }
});

// GET /admin/users
router.get("/users", authenticate, requireRole("admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            registrations: true,
            hackathons: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString().slice(0, 10),
      lastLogin: "Active Today",
      hackathonsCount: u.role === "organizer" ? u._count.hackathons : u._count.registrations,
      avatarUrl: u.avatarUrl || undefined,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// POST /admin/users/:id/toggle-status
router.post("/users/:id/toggle-status", authenticate, requireRole("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const nextStatus = user.status === "active" ? "suspended" : "active";
    const updated = await prisma.user.update({
      where: { id },
      data: { status: nextStatus },
    });

    await logAudit(
      req,
      "USER_STATUS_TOGGLED",
      `${updated.name} (${updated.email}) -> ${updated.status.toUpperCase()}`,
      "User",
      updated.id,
      `Administrative intervention changed account status to ${updated.status}`
    );

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status,
      createdAt: updated.createdAt.toISOString().slice(0, 10),
      lastLogin: "Active Today",
      hackathonsCount: 2,
    });
  } catch (err: any) {
    console.error("Toggle user status error:", err);
    res.status(500).json({ error: "Failed to toggle user status." });
  }
});

// POST /admin/users/:id/role - Admin update user role (promote to Admin, Organizer, Judge, or Participant)
router.post("/users/:id/role", authenticate, requireRole("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["participant", "organizer", "judge", "admin"];
    if (!role || !validRoles.includes(String(role).toLowerCase())) {
      res.status(400).json({ error: "Invalid role specified. Must be participant, organizer, judge, or admin." });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: String(role).toLowerCase() },
    });

    await logAudit(
      req,
      "USER_ROLE_PROMOTED",
      `${updated.name} (${updated.email}) -> ${updated.role.toUpperCase()}`,
      "User",
      updated.id,
      `Administrative role modification executed by ${req.user!.email}`
    );

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status,
      createdAt: updated.createdAt.toISOString().slice(0, 10),
      lastLogin: "Active Today",
      hackathonsCount: 0,
    });
  } catch (err: any) {
    console.error("Update user role error:", err);
    res.status(500).json({ error: "Failed to update user role." });
  }
});

// POST /admin/users - Admin provision user account
router.post("/users", authenticate, requireRole("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and initial password are required to provision an account." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      res.status(409).json({ error: "User with this email already exists." });
      return;
    }

    const validRoles = ["participant", "organizer", "judge", "admin"];
    const targetRole = role && validRoles.includes(String(role).toLowerCase())
      ? String(role).toLowerCase()
      : "participant";

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: targetRole,
        status: "active",
      },
    });

    await logAudit(
      req,
      "USER_PROVISIONED_BY_ADMIN",
      `${newUser.name} (${newUser.email}) as ${newUser.role.toUpperCase()}`,
      "User",
      newUser.id,
      `Account provisioned by platform admin ${req.user!.email}`
    );

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt.toISOString().slice(0, 10),
      lastLogin: "Never",
      hackathonsCount: 0,
    });
  } catch (err: any) {
    console.error("Admin provision user error:", err);
    res.status(500).json({ error: "Failed to provision user." });
  }
});

// GET /admin/hackathons
router.get("/hackathons", authenticate, requireRole("admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const hackathons = await prisma.hackathon.findMany({
      include: {
        _count: {
          select: {
            registrations: true,
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = hackathons.map((h) => ({
      id: h.id,
      title: h.title,
      organizerName: h.organizerName || "Consensus Arena Ops",
      organizerEmail: h.organizerEmail || "organizer@consensus.dev",
      category: h.category,
      prizePool: h.totalPrizePool,
      status: h.status,
      submittedForReviewAt: h.createdAt.toISOString().slice(0, 10),
      startDate: h.hackathonStart,
      endDate: h.hackathonEnd,
      registrationsCount: h._count.registrations,
      submissionsCount: h._count.submissions,
      complianceChecked: true,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Admin hackathons error:", err);
    res.status(500).json({ error: "Failed to fetch admin hackathons." });
  }
});

// POST /admin/hackathons/:id/status
router.post("/hackathons/:id/status", authenticate, requireRole("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.hackathon.update({
      where: { id },
      data: { status },
      include: {
        _count: {
          select: {
            registrations: true,
            submissions: true,
          },
        },
      },
    });

    await logAudit(
      req,
      "HACKATHON_STATUS_MODIFIED",
      `${updated.title} -> ${status.toUpperCase()}`,
      "Hackathon",
      updated.id,
      `Admin status update: ${status}`
    );

    res.json({
      id: updated.id,
      title: updated.title,
      organizerName: updated.organizerName || "Consensus Arena Ops",
      organizerEmail: updated.organizerEmail || "organizer@consensus.dev",
      category: updated.category,
      prizePool: updated.totalPrizePool,
      status: updated.status,
      submittedForReviewAt: updated.createdAt.toISOString().slice(0, 10),
      startDate: updated.hackathonStart,
      endDate: updated.hackathonEnd,
      registrationsCount: updated._count.registrations,
      submissionsCount: updated._count.submissions,
      complianceChecked: true,
    });
  } catch (err: any) {
    console.error("Update hackathon status error:", err);
    res.status(500).json({ error: "Failed to update hackathon status." });
  }
});

// GET /admin/audit-logs - List audit logs with filtering
router.get("/audit-logs", authenticate, requireRole("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, userRole, search } = req.query;
    const where: any = {};

    if (action && action !== "all") {
      where.action = String(action);
    }
    if (userRole && userRole !== "all") {
      where.userRole = String(userRole);
    }
    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { userEmail: { contains: q, mode: "insensitive" } },
        { action: { contains: q, mode: "insensitive" } },
        { resource: { contains: q, mode: "insensitive" } },
        { metadata: { contains: q, mode: "insensitive" } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    const formatted = logs.map((l) => ({
      id: l.id,
      timestamp: l.timestamp.toISOString().replace("T", " ").slice(0, 19) + " UTC",
      userEmail: l.userEmail,
      userRole: l.userRole,
      action: l.action,
      resource: l.resource,
      status: l.status,
      ipAddress: l.ipAddress,
      metadata: l.metadata || undefined,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Get audit logs error:", err);
    res.status(500).json({ error: "Failed to fetch audit logs." });
  }
});

// GET /admin/audit-logs/download-csv - Download real CSV from DB records
router.get("/audit-logs/download-csv", authenticate, requireRole("admin"), async (_req: Request, res: Response): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 500,
    });

    // Generate CSV content
    const headers = ["Timestamp", "User Email", "Role", "Action", "Resource Target", "Entity Type", "Entity ID", "Status", "IP Address", "Metadata"];
    const rows = logs.map((l) => [
      `"${l.timestamp.toISOString()}"`,
      `"${l.userEmail}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${(l.resource || "").replace(/"/g, '""')}"`,
      `"${l.entityType || ""}"`,
      `"${l.entityId || ""}"`,
      `"${l.status}"`,
      `"${l.ipAddress}"`,
      `"${(l.metadata || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="consensus-audit-logs.csv"');
    res.send(csvContent);
  } catch (err: any) {
    console.error("Download audit logs CSV error:", err);
    res.status(500).json({ error: "Failed to generate audit log CSV." });
  }
});

export default router;
