# 🎓 CampusSynapse: Smart Campus Project Team Formation & Contribution System

A full-stack, enterprise-grade web application designed for universities and colleges to form balanced, high-synergy project teams based on student skills, verified academic merits, availability schedules, and primary superpowers.

---

## 🌟 The 5-Step Core Workflow

1. **Step 1: Student Profile & Gmail Availability Portal**
   - Centralized campus talent roster containing student profiles, academic GPAs, verified technical skills with 1–5 star proficiencies, and primary superpowers (*"In what they are best at"*).
   - **Student Login via Campus Gmail**: Direct authentication using Google Gmail with instant session memory.
   - **"Update Availability via Gmail" Button**: Students can log in with their campus Gmail, set their status (`AVAILABLE`, `LIMITED`, `BUSY`), adjust available hours per week (5–40h/wk), and sync with one click.
   - **Google Calendar Bandwidth Detection**: Analyzes course schedules to automatically calculate free project hours.
   - Real-time availability tracking: weekly available hours (e.g. 15h, 20h, 25h/wk) immediately update team matching algorithms in Steps 3 & 4.
   - Dynamic search, discipline filters, detailed student dossier view, and profile registration/editing modal.

2. **Step 2: Project Requirement**
   - Specification engine for faculty and project leads to define project scope, required roles (e.g., Frontend Lead, Backend Architect, AI/ML Engineer, UI/UX Designer), and role-specific skill demands.
   - Configurable constraints: team size, minimum student GPA, weekly time commitment, and project duration.
   - 1-click enterprise project templates (*Full-Stack SaaS Platform*, *AI Medical Diagnostics Companion*).

3. **Step 3: Skill Match**
   - Multi-dimensional candidate evaluation algorithm calculating compatibility percentages (0–100%).
   - Comprehensive breakdown across three core axes:
     - **Skill Fitness Score**: Vector overlap between student proficiency and required skills.
     - **Availability Compatibility Score**: Weekly hours buffer and schedule suitability.
     - **Merit & Superpower Alignment**: GPA boost, hackathons won, and alignment with primary role strength.
   - Granular breakdown of **Matched Skills** vs. **Missing/Deficit Skills** for each candidate.

4. **Step 4: Team Suggestion & Assembly**
   - Automated multi-criteria optimization algorithm generating 3 distinct team compositions:
     - **Optimal Balanced Team**: Maximizes global technical coverage and role alignment.
     - **High-Merit Vanguard**: Prioritizes academic merit, hackathon trophies, and proven leadership.
     - **Rapid-Sprint Availability**: Tailored for maximum weekly bandwidth and rapid sprint execution.
   - Live **Synergy Meter** and **Full Technical Coverage** indicators.
   - Interactive Candidate Customizer: Swap or substitute candidates for any role with live recalculation of synergy scores before locking.

5. **Step 5: Contribution Report & Analytics**
   - Post-formation project management dashboard and team workspace.
   - Workload distribution charts tracking task allocation and equity across team members.
   - Engineering effort categorized by domain (Development, UI/UX Design, Research/AI, Documentation, Testing).
   - Interactive task logging modal to log milestone hours and faculty impact ratings (1 to 5 stars).
   - **Print / PDF-Ready Audit Report** formatted for official capstone review, faculty submission, and grading.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + Vite (Modern, fast, modular single-page application)
  - Custom Responsive Theme (Deep slate / indigo aesthetics, glassmorphism, glowing telemetry indicators)
  - Lucide React (Clean icon system)
  - Canvas Confetti (Celebratory feedback upon team formation)
- **Backend**:
  - Python 3.12 + Flask
  - SQLAlchemy 2.0 ORM
  - RESTful API Architecture + CORS Support
  - Intelligent Team Matching & Synergy Optimization Engine
- **Database**:
  - **MySQL** (Primary production database with schema DDL, relational constraints, and seed data in `database/`)
  - **Auto-fallback SQLite** (`campus_teams.db`): Automatically activates if a local MySQL daemon is not running, ensuring zero-friction setup and immediate out-of-the-box functionality!

---

## 🚀 Quick Start Guide

### 1. Launch Everything with 1 Click (Windows)
Double-click `run_project.bat` in the root folder, or run:
```powershell
.\run_project.bat
```
This automatically launches both the Python Flask backend on port `5000` and the Vite React frontend on port `5173`.

### 2. Manual Startup

#### Backend:
```powershell
cd backend
.\venv\Scripts\python.exe app.py
```
Backend runs at `http://127.0.0.1:5000`.

#### Frontend:
```powershell
cd frontend
npm run dev
```
Frontend runs at `http://127.0.0.1:5173`.

---

## 🗄️ MySQL Database Setup (Optional / Production)

If you have MySQL installed and running:
1. Open MySQL Workbench or CLI and run the DDL script:
   ```sql
   source database/schema.sql;
   source database/seed.sql;
   ```
2. Copy `backend/.env.example` to `backend/.env` and update your MySQL credentials:
   ```env
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=campus_teams_db
   ```
3. Restart the backend; it will connect directly to MySQL!

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health, database mode (MySQL/SQLite), and metrics |
| `POST` | `/api/students/login-gmail` | Authenticate student via campus Gmail account |
| `POST` | `/api/students/availability-gmail` | Update student availability and weekly hours via Gmail |
| `GET` | `/api/students` | Get all students with search & filter parameters |
| `POST` | `/api/students` | Register a new student profile |
| `PUT` | `/api/students/<id>` | Update an existing student profile |
| `GET` | `/api/projects` | Fetch all project specifications |
| `POST` | `/api/projects` | Create a new project with roles and required skills |
| `GET` | `/api/projects/<id>/match` | Calculate candidate compatibility for all project roles |
| `GET` | `/api/projects/<id>/team-suggestions` | Generate 3 automated balanced team suggestions |
| `POST` | `/api/teams` | Confirm and form a team into the database |
| `GET` | `/api/teams/<id>/report` | Get complete team contribution and workload analytics |
| `POST` | `/api/teams/<id>/contributions` | Log a milestone task/contribution for a member |

