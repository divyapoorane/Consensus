import { Router, Request, Response } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../prisma.js";
import { authenticate, optionalAuthenticate, requireRole } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /api/certificates - List certificates
router.get("/", optionalAuthenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    let where = {};

    if (userRole === "participant") {
      where = {
        OR: [
          { recipientEmail: req.user!.email },
          { status: "issued" },
        ],
      };
    }

    const certs = await prisma.certificate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = certs.map((c) => ({
      id: c.id,
      certificateId: c.certificateId,
      recipientName: c.recipientName,
      recipientEmail: c.recipientEmail,
      type: c.type,
      hackathonId: c.hackathonId,
      hackathonTitle: c.hackathonTitle,
      achievement: c.achievement,
      issuedAt: c.issuedAt.toISOString(),
      status: c.status,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("Get certificates error:", err);
    res.status(500).json({ error: "Failed to fetch certificates." });
  }
});

// POST /api/certificates/issue - Issue certificate
router.post(
  "/issue",
  authenticate,
  requireRole("organizer", "admin"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, recipientName, recipientEmail, hackathonTitle, type, achievement } = req.body;

      if (id) {
        const updated = await prisma.certificate.update({
          where: { id },
          data: {
            status: "issued",
            issuedAt: new Date(),
          },
        });

        await logAudit(
          req,
          "CERTIFICATE_ISSUED",
          `Issued ${updated.certificateId} to ${updated.recipientName}`,
          "Certificate",
          updated.id
        );

        res.json(updated);
        return;
      }

      const count = await prisma.certificate.count();
      const certificateId = `CERT-CNS-2026-${String(900 + count + 1)}`;
      const firstHack = await prisma.hackathon.findFirst();

      const created = await prisma.certificate.create({
        data: {
          certificateId,
          recipientName: recipientName || "Alex Vance",
          recipientEmail: recipientEmail || "participant@consensus.dev",
          type: type || "participant",
          hackathonId: firstHack?.id || "hack-01",
          hackathonTitle: hackathonTitle || firstHack?.title || "Autonomous Systems & AI Arena",
          achievement: achievement || "Verified Track Contributor & Consensus Finalist",
          status: "issued",
          issuedAt: new Date(),
        },
      });

      await logAudit(
        req,
        "CERTIFICATE_GENERATED",
        `Created ${created.certificateId} for ${created.recipientName}`,
        "Certificate",
        created.id
      );

      res.status(201).json(created);
    } catch (err: any) {
      console.error("Issue certificate error:", err);
      res.status(500).json({ error: "Failed to issue certificate." });
    }
  }
);

// GET /api/certificates/:id/download - Generate real PDF and stream download
router.get("/:id/download", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Search by ID or certificateId
    let cert = await prisma.certificate.findFirst({
      where: {
        OR: [{ id }, { certificateId: id }],
      },
    });

    if (!cert) {
      // Fallback certificate if specific ID not found in DB
      cert = {
        id: "cert-default",
        certificateId: "CERT-CNS-2026-901",
        recipientName: "Alex Vance",
        recipientEmail: "participant@consensus.dev",
        type: "winner",
        hackathonId: "hack-01",
        hackathonTitle: "Autonomous Systems & AI Arena",
        achievement: "Grand Consensus Winner — 1st Place",
        issuedAt: new Date(),
        status: "issued",
        createdAt: new Date(),
      };
    }

    const filename = `consensus-certificate-${cert.certificateId.toLowerCase()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Create a landscape PDF document
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margin: 40,
    });

    doc.pipe(res);

    // --- Background & Border ---
    const width = doc.page.width;
    const height = doc.page.height;

    // Dark sleek background
    doc.rect(0, 0, width, height).fill("#111111");

    // Outer accent border
    doc.lineWidth(3);
    doc.strokeColor("#FF6B35");
    doc.rect(20, 20, width - 40, height - 40).stroke();

    // Inner subtle border
    doc.lineWidth(1);
    doc.strokeColor("#333333");
    doc.rect(26, 26, width - 52, height - 52).stroke();

    // --- Header / Branding ---
    doc.fontSize(13);
    doc.fillColor("#FF6B35");
    doc.font("Helvetica-Bold");
    doc.text("C O N S E N S U S   A R E N A", 0, 60, { align: "center" });

    doc.fontSize(9);
    doc.fillColor("#888888");
    doc.font("Helvetica");
    doc.text("VERIFIABLE DIGITAL HACKATHON CREDENTIAL", 0, 78, { align: "center" });

    // Decorative divider line
    doc.moveTo(width / 2 - 120, 95).lineTo(width / 2 + 120, 95).strokeColor("#FF6B35").lineWidth(1.5).stroke();

    // --- Certificate Title ---
    doc.moveDown(1.8);
    doc.fontSize(26);
    doc.fillColor("#FFFFFF");
    doc.font("Helvetica-Bold");
    const certTitle =
      cert.type.toUpperCase() === "WINNER"
        ? "CERTIFICATE OF EXCELLENCE"
        : cert.type.toUpperCase() === "JUDGE"
        ? "CERTIFICATE OF JUROR HONOR"
        : "CERTIFICATE OF PARTICIPATION";
    doc.text(certTitle, 0, 115, { align: "center" });

    // --- Recipient Name ---
    doc.moveDown(0.8);
    doc.fontSize(11);
    doc.fillColor("#A1A1A1");
    doc.font("Helvetica");
    doc.text("THIS ACKNOWLEDGES AND CERTIFIES THAT", 0, 160, { align: "center" });

    doc.fontSize(30);
    doc.fillColor("#FF7F50");
    doc.font("Helvetica-Bold");
    doc.text(cert.recipientName, 0, 185, { align: "center" });

    // Underline for name
    doc.moveTo(width / 2 - 160, 225).lineTo(width / 2 + 160, 225).strokeColor("#444444").lineWidth(0.8).stroke();

    // --- Achievement & Hackathon ---
    doc.fontSize(11);
    doc.fillColor("#A1A1A1");
    doc.font("Helvetica");
    doc.text("has successfully built, demonstrated, and passed double-blind jury evaluation in", 0, 245, {
      align: "center",
    });

    doc.fontSize(18);
    doc.fillColor("#FFFFFF");
    doc.font("Helvetica-Bold");
    doc.text(cert.hackathonTitle, 0, 268, { align: "center" });

    doc.fontSize(13);
    doc.fillColor("#FF6B35");
    doc.font("Helvetica");
    doc.text(`Distinction: ${cert.achievement}`, 0, 298, { align: "center" });

    // --- Signatures & Verification Details ---
    const sigY = 380;

    // Left Signature: Director
    doc.moveTo(80, sigY + 30).lineTo(260, sigY + 30).strokeColor("#555555").lineWidth(1).stroke();
    doc.fontSize(10);
    doc.fillColor("#FFFFFF");
    doc.font("Helvetica-Bold");
    doc.text("Consensus Arena Ops", 80, sigY + 36, { width: 180, align: "center" });
    doc.fontSize(8);
    doc.fillColor("#888888");
    doc.font("Helvetica");
    doc.text("Lead Hackathon Program Director", 80, sigY + 50, { width: 180, align: "center" });

    // Center Badge / QR Simulated Seal
    doc.circle(width / 2, sigY + 25, 30).fillColor("#1c1c1c").strokeColor("#FF6B35").lineWidth(1.5).fillAndStroke();
    doc.fontSize(9);
    doc.fillColor("#FF6B35");
    doc.font("Helvetica-Bold");
    doc.text("VERIFIED", width / 2 - 25, sigY + 12, { width: 50, align: "center" });
    doc.fontSize(7);
    doc.fillColor("#AAAAAA");
    doc.text("CONSENSUS", width / 2 - 25, sigY + 24, { width: 50, align: "center" });
    doc.text("LEDGER", width / 2 - 25, sigY + 34, { width: 50, align: "center" });

    // Right Signature: Lead Juror
    doc.moveTo(width - 260, sigY + 30).lineTo(width - 80, sigY + 30).strokeColor("#555555").lineWidth(1).stroke();
    doc.fontSize(10);
    doc.fillColor("#FFFFFF");
    doc.font("Helvetica-Bold");
    doc.text("Dr. Sarah Lin", width - 260, sigY + 36, { width: 180, align: "center" });
    doc.fontSize(8);
    doc.fillColor("#888888");
    doc.font("Helvetica");
    doc.text("Lead Juror & Consensus Scientist", width - 260, sigY + 50, { width: 180, align: "center" });

    // Footer Info
    doc.fontSize(8);
    doc.fillColor("#666666");
    doc.font("Helvetica");
    const issueDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Issued: ${issueDate}   |   Certificate ID: ${cert.certificateId}   |   Consensus Protocol Demo Attestation`, 0, height - 42, {
      align: "center",
    });

    doc.end();

    // Async log download in background
    logAudit(
      req,
      "CERTIFICATE_PDF_DOWNLOADED",
      `Downloaded PDF for ${cert.recipientName} (${cert.certificateId})`,
      "Certificate",
      cert.id
    );
  } catch (err: any) {
    console.error("Certificate download error:", err);
    res.status(500).json({ error: "Failed to generate certificate PDF." });
  }
});

export default router;
