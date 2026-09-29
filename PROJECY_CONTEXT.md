# CONSENSUS — PROJECT CONTEXT

## 1. PROJECT OVERVIEW

Project name: Consensus

Type: College / Hackathon project

Goal:
Consensus is a hackathon platform where participants can discover and register for hackathons, create/join teams, create projects, submit projects, and receive evaluations from judges. Organizers can create and manage hackathons, while admins can manage users and hackathons.

This is NOT an enterprise application.

Keep the implementation simple, practical, and suitable for a college/hackathon project.

Do not over-engineer the project.

---

# 2. CURRENT PROJECT STRUCTURE

The project must have this structure:

Consensus/
├── PROJECT_CONTEXT.md
├── frontend/
└── backend/

IMPORTANT:

The frontend folder already exists and is finalized.

The backend folder will be created separately.

NEVER create backend files inside frontend/.

---

# 3. FRONTEND

The frontend is an existing Vite + React + TypeScript application.

Frontend:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Motion

Frontend development server:

http://localhost:3000

The frontend is already visually finalized.

IMPORTANT FRONTEND RULE:

DO NOT MODIFY THE FRONTEND unless the user explicitly asks you to.

Do NOT:

- modify frontend source files
- modify frontend/package.json
- modify frontend configuration
- modify frontend styling
- modify frontend routes
- modify frontend components
- rename frontend files
- move frontend files
- delete frontend files
- install backend dependencies inside frontend

You MAY inspect/read frontend files when necessary to understand how the backend should work.

Reading the frontend is allowed.

Modifying it is NOT allowed unless explicitly requested.

---

# 4. CURRENT FRONTEND STATE

The frontend currently works as a UI prototype.

It contains mock/in-memory services instead of a real backend.

There is currently:

- no real Consensus backend
- no PostgreSQL connection
- no Prisma
- no real authentication
- no real REST API connection
- no shared persistent database

The frontend currently uses mock services/data for things such as:

- authentication
- participants
- organizers
- judges
- admins
- hackathons
- teams
- projects
- submissions
- evaluations

The purpose of the backend is to eventually replace these mock services with a real API and PostgreSQL database.

---

# 5. TARGET ARCHITECTURE

The target architecture is:

Browser
    |
    | HTTP / JSON
    | Authorization: Bearer JWT
    ↓
React + Vite
localhost:3000
    |
    ↓
Node.js + Express + TypeScript
localhost:4000
    |
    ↓
Prisma
    |
    ↓
PostgreSQL


Simple architecture only.

DO NOT introduce:

- microservices
- Redis
- Kubernetes
- Docker
- message queues
- unnecessary cloud infrastructure
- complex service architecture

unless the user explicitly asks for them.

---

# 6. BACKEND STACK

Backend technology:

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- dotenv
- CORS
- bcrypt
- JWT

Development server:

http://localhost:4000

Backend should be simple and organized.

---

# 7. BACKEND DEVELOPMENT PHASES

Build the backend in separate phases.

DO NOT attempt to build everything at once.

PHASE 1:
Backend setup

- Node.js
- Express
- TypeScript
- tsx
- dotenv
- CORS
- GET /health
- port 4000

PHASE 2:
Database setup

- PostgreSQL
- Prisma
- DATABASE_URL
- Prisma initialization
- database connection

PHASE 3:
Database schema

Create the required models and relationships.

PHASE 4:
Seed data

Create useful demo data.

PHASE 5:
Authentication

- registration
- login
- password hashing
- JWT
- authentication middleware
- role-based authorization

PHASE 6:
Hackathon APIs

PHASE 7:
Registration / Team / Project APIs

PHASE 8:
Submission APIs

PHASE 9:
Judge / Evaluation APIs

PHASE 10:
Admin APIs

PHASE 11:
Frontend integration

PHASE 12:
Testing and bug fixing

IMPORTANT:

Only work on the phase requested by the user.

When a phase is complete, STOP.

Do not automatically continue to the next phase.

---

# 8. PHASE 1 REQUIREMENTS

For the initial backend setup, create:

backend/

with a minimal Express + TypeScript server.

Requirements:

- Express
- TypeScript
- tsx
- dotenv
- cors
- required TypeScript types

Backend port:

4000

CORS:

Allow:

http://localhost:3000

Health endpoint:

GET /health

Expected response:

{
  "success": true
}

After completing Phase 1:

- install dependencies
- start the server
- test /health
- confirm it works
- show the created files

Then STOP.

Do NOT install Prisma during Phase 1.

Do NOT create database tables during Phase 1.

Do NOT implement authentication during Phase 1.

Do NOT integrate the frontend during Phase 1.

---

# 9. DATABASE

Database:

PostgreSQL

Database name:

consensus_db

Local development connection will use:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/consensus_db"

IMPORTANT:

Never hardcode the PostgreSQL password into source code.

Never commit .env files containing real passwords or secrets.

Use .env for secrets.

---

# 10. REQUIRED DATABASE ENTITIES

The core backend requires these entities:

1. User
2. Hackathon
3. Registration
4. Team
5. TeamMember
6. Project
7. Submission
8. JudgeAssignment
9. Evaluation

Use proper relationships between these entities.

Use enums where appropriate.

Important constraints include:

- User.email must be unique
- Team.inviteCode must be unique
- A user should not register for the same hackathon multiple times
- Appropriate foreign keys and relationships must be used

Do not add unnecessary models unless required by the actual functionality.

---

# 11. USER ROLES

The system has four roles:

- PARTICIPANT
- ORGANIZER
- JUDGE
- ADMIN

Admin accounts are seed-created.

Admin users should NOT have normal public registration.

Role-based access must eventually be enforced by the backend.

Do NOT rely on frontend-only role protection for security.

---

# 12. AUTHENTICATION

The eventual authentication system should use:

- bcrypt for password hashing
- JWT for authentication
- Authorization: Bearer <token>

Required authentication endpoints:

POST /auth/register
POST /auth/login
GET /auth/me

Logout can be handled client-side if appropriate.

The backend must validate authentication.

Never store plaintext passwords.

---

# 13. CORE API AREAS

The backend will eventually provide APIs for:

AUTH:
- register
- login
- current user

PUBLIC:
- list hackathons
- get hackathon details

PARTICIPANT:
- profile
- statistics
- registered hackathons
- teams
- projects
- submissions

ORGANIZER:
- statistics
- create hackathon
- manage hackathons
- participants
- teams
- submissions
- judges
- results

JUDGE:
- profile
- statistics
- assigned projects
- evaluations

ADMIN:
- statistics
- users
- hackathons
- status management

---

# 14. FRONTEND INTEGRATION

Frontend integration happens ONLY after the backend APIs are working.

Eventually the frontend will use:

VITE_API_URL=http://localhost:4000

The frontend's existing mock services should be replaced gradually with API calls.

Do NOT rewrite the entire frontend.

Prefer modifying the existing service layer so the existing UI remains intact.

Do not change the visual design unless explicitly requested.

---

# 15. ENVIRONMENT VARIABLES

Frontend eventually:

VITE_API_URL=http://localhost:4000

Backend:

DATABASE_URL=...
JWT_SECRET=...
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development

Never expose:

- DATABASE_URL
- PostgreSQL password
- JWT_SECRET

to the frontend.

---

# 16. DEMO DATA

The project should eventually have seed data for testing.

Seed data should include:

- demo users for the main roles
- 1–2 hackathons
- at least one registration
- at least one team
- at least one project
- at least one submission
- at least one evaluation

Keep seed data simple.

---

# 17. CODE STYLE

Keep the code:

- readable
- simple
- maintainable
- beginner-friendly
- appropriately structured

Do not create unnecessary abstractions.

Do not create dozens of files when a simpler structure is sufficient.

Do not introduce design patterns just for the sake of using them.

Use TypeScript properly.

Handle errors clearly.

Use environment variables for configuration.

---

# 18. AI CODING RULES

When working on this project:

1. Read this file before making changes.
2. Inspect the existing project before creating new code.
3. Understand the current phase.
4. Only implement the requested phase.
5. Do not modify unrelated files.
6. Do not modify frontend files unless explicitly requested.
7. Do not delete working code without a reason.
8. Do not rewrite working code unnecessarily.
9. Do not add dependencies that are not needed.
10. Do not over-engineer.
11. Test the changes you make.
12. Report what was changed.
13. Report any errors instead of hiding them.
14. Stop when the requested phase is complete.

---

# 19. IMPORTANT PROJECT RULE

The frontend is already finalized.

Treat it as protected.

If backend work requires understanding the frontend:

READ/INSPECT the frontend.

Do NOT MODIFY it.

Frontend modifications will happen later during the explicit frontend integration phase.

---

# 20. CURRENT STATUS

Current phase:

PHASE 1 — BACKEND SETUP

Frontend:

COMPLETED / FINALIZED

Backend:

NOT YET CREATED

Database:

NOT YET CONNECTED

Prisma:

NOT YET INSTALLED

Authentication:

NOT YET IMPLEMENTED

Frontend integration:

NOT YET STARTED

---

# 21. CURRENT TASK

The current task is:

Create the backend folder and complete ONLY the basic backend setup.

After the backend responds successfully to:

GET http://localhost:4000/health

stop and wait for the next instruction.

DO NOT continue automatically.