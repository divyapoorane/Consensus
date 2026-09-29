# Consensus Architecture & System Design

## 1. Overview
Consensus is an open-source, self-hostable submission and judging platform for competitive developer hackathons. It guarantees cryptographic role isolation, double-blind juror deliberation, and score normalization across multi-judge panels.

```
Browser (React + Vite, localhost:8080)
    │
    │ HTTP / JSON (Bearer JWT / Session Header)
    ▼
Node.js + Express 4 REST API (localhost:4000)
    │
    ├── Prisma ORM 5.x
    │       ▼
    └── PostgreSQL 15 (consensus_db)
```

## 2. Core Architectural Pillars
- **Strict Role Isolation Enforced at Backend**: All routes enforce JWT authentication and role validation (`participant`, `judge`, `organizer`, `admin`). A judge requesting another judge's score cards receives a strict `401/403 Forbidden` response.
- **Double-Blind Scoring & Outlier Normalization**: Jurors score blinded submissions across weighted criteria (Technical Architecture, Innovation, Execution, UI/UX, Presentation). The consensus engine uses z-score normalization and outlier filtering before aggregating composite results.
- **Verifiable Credential Generation**: On-the-fly server-rendered vector PDF certificates with tamper-evident digital hashes using Node.js + PDFKit.
- **Real-Time Deliberation Chambers**: Interactive audio/video pitch rooms utilizing browser WebRTC/MediaStream APIs with screen sharing, slide inspection, and presence rosters.
