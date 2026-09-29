import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/auth.js";
import hackathonRoutes from "./routes/hackathons.js";
import participantRoutes from "./routes/participant.js";
import judgeRoutes from "./routes/judge.js";
import organizerRoutes from "./routes/organizer.js";
import adminRoutes from "./routes/admin.js";
import payoutRoutes from "./routes/payouts.js";
import certificateRoutes from "./routes/certificates.js";
import disputeRoutes from "./routes/disputes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost on any port (3000, 5173, etc.) or no origin (curl/Postman)
      if (!origin || origin.includes("localhost") || origin === clientOrigin) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/participant", participantRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/disputes", disputeRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

import { ensureAdminBootstrap } from "./utils/bootstrapAdmin.js";

app.listen(port, async () => {
  console.log(`Backend running on http://localhost:${port}`);
  await ensureAdminBootstrap();
});
