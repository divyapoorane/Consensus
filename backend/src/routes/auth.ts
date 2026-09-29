import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { authenticate } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "consensus_jwt_secret_college_hackathon_demo_2026";

function sanitizeUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}

// POST /auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required for registration." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const requestedRole = (role || "participant").toLowerCase();
    if (requestedRole === "admin") {
      res.status(403).json({
        error: "Administrator accounts cannot be registered publicly. They must be provisioned by platform governance.",
      });
      return;
    }

    const allowedRoles = ["participant", "organizer", "judge"];
    const assignedRole = allowedRoles.includes(requestedRole) ? requestedRole : "participant";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    await logAudit(
      req,
      "USER_REGISTERED",
      `${user.name} (${user.email})`,
      "User",
      user.id,
      `New user registered with role ${user.role}`
    );

    res.status(201).json({
      user: sanitizeUser(user),
      token,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials. Account not found. Please register first." });
      return;
    }

    if (user.status === "suspended") {
      res.status(403).json({ error: "Account is suspended. Please contact platform administration." });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Invalid credentials. Incorrect password." });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    await logAudit(
      req,
      "USER_LOGIN",
      `${user.name} (${user.email})`,
      "User",
      user.id,
      `User authenticated successfully into ${user.role} workspace`
    );

    res.json({
      user: sanitizeUser(user),
      token,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to log in." });
  }
});

// GET /auth/me
router.get("/me", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err: any) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Failed to fetch user session." });
  }
});

export default router;
