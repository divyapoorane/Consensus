# Consensus // Hackathon Platform

Autonomous, self-hostable submission and judging platform for competitive hackathons.

## Features
- **T1 Core**: Participant & squad management, immutable deadline enforcement, public project gallery.
- **T2 Judging**: Double-blind scoring rubrics, backend-enforced role isolation, cross-judge normalization, CSV export.
- **T3 Public**: Interactive deliberation rooms, presentation slide decks, anti-abuse audit trails.
- **T4 Stretch**: Cryptographic PDF certificate streaming, REST APIs.

## One-Command Deployment
```bash
docker compose up
```
Portal listens on `http://localhost:8080`.

## Acceptance Verification
```bash
python3 run.py .dogfood.toml > acceptance-report.txt
```
