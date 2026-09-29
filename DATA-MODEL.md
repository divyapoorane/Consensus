# Consensus Data Model & Schemas

## 1. Relational Entity Overview
Consensus uses PostgreSQL managed via Prisma ORM (`backend/prisma/schema.prisma`).

```
User (id, email, password, role, name)
  ├── 1:M ── Registration (userId, hackathonId, status)
  ├── 1:M ── TeamMember (userId, teamId, role)
  ├── 1:M ── Evaluation (judgeId, projectId, scores, feedback)
  └── 1:M ── Certificate (recipientEmail, type, hash)

Hackathon (id, title, description, submissionsClose, status)
  ├── 1:M ── Project (hackathonId, title, teamId, status)
  │             └── 1:1 ── Submission (projectId, score, feedback)
  └── 1:M ── JudgeAssignment (hackathonId, judgeId)

Team (id, name, inviteCode, hackathonId)
  └── 1:M ── TeamMember
```

## 2. Import & Export Paths
- **JSON Ingestion**: Compatible with DOGFOOD `fixtures.json` (Events, Tracks, Judges, Teams, Projects, and Scores).
- **CSV Export**: `GET /api/export/csv` generates delimited reports with rank, project title, squad, judge scores, and award allocations.
- **Certificate Stream**: `GET /api/certificates/:id/download` streams cryptographic vector PDF credentials.
