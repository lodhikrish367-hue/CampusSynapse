import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    roll_no = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    department = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    gpa = Column(Float, nullable=False)
    merit_score = Column(Integer, default=50) # 0 to 100
    primary_strength = Column(String(100), nullable=False) # In what they are best
    availability_status = Column(String(20), default="AVAILABLE") # AVAILABLE, LIMITED, BUSY
    available_hours_per_week = Column(Integer, default=15)
    bio = Column(Text, nullable=True)
    github_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    avatar = Column(String(255), nullable=True)
    past_projects_count = Column(Integer, default=0)
    hackathons_won = Column(Integer, default=0)
    leadership_badge = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    memberships = relationship("TeamMember", back_populates="student")
    contributions = relationship("Contribution", back_populates="student")

    def to_dict(self):
        return {
            "id": self.id,
            "roll_no": self.roll_no,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "year": self.year,
            "gpa": float(self.gpa) if self.gpa is not None else 0.0,
            "merit_score": self.merit_score,
            "primary_strength": self.primary_strength,
            "availability_status": self.availability_status,
            "available_hours_per_week": self.available_hours_per_week,
            "bio": self.bio or "",
            "github_url": self.github_url or "",
            "portfolio_url": self.portfolio_url or "",
            "avatar": self.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "past_projects_count": self.past_projects_count or 0,
            "hackathons_won": self.hackathons_won or 0,
            "leadership_badge": bool(self.leadership_badge),
            "skills": [s.to_dict() for s in self.skills]
        }


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False)
    category = Column(String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category
        }


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(80), nullable=False)
    proficiency_level = Column(Integer, nullable=False) # 1 to 5
    years_experience = Column(Float, default=1.0)
    verified_merit = Column(Boolean, default=True)

    student = relationship("Student", back_populates="skills")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "skill_name": self.skill_name,
            "proficiency_level": self.proficiency_level,
            "years_experience": float(self.years_experience or 1.0),
            "verified_merit": bool(self.verified_merit)
        }


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    domain = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    team_size = Column(Integer, default=4)
    min_gpa = Column(Float, default=7.0)
    min_hours_per_week = Column(Integer, default=12)
    duration_weeks = Column(Integer, default=8)
    status = Column(String(50), default="PLANNING") # PLANNING, TEAM_FORMED, IN_PROGRESS, COMPLETED
    created_at = Column(DateTime, default=datetime.utcnow)

    roles = relationship("ProjectRole", back_populates="project", cascade="all, delete-orphan")
    teams = relationship("Team", back_populates="project", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "domain": self.domain,
            "description": self.description or "",
            "team_size": self.team_size,
            "min_gpa": float(self.min_gpa) if self.min_gpa is not None else 0.0,
            "min_hours_per_week": self.min_hours_per_week,
            "duration_weeks": self.duration_weeks,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "roles": [r.to_dict() for r in self.roles],
            "teams": [t.to_dict(include_members=False) for t in self.teams]
        }


class ProjectRole(Base):
    __tablename__ = "project_roles"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    role_name = Column(String(100), nullable=False)
    required_skills = Column(Text, nullable=False) # JSON list: [{"skill": "React", "min_level": 3, "weight": 5}]
    is_lead = Column(Boolean, default=False)

    project = relationship("Project", back_populates="roles")

    def to_dict(self):
        try:
            req_skills = json.loads(self.required_skills) if self.required_skills else []
        except Exception:
            req_skills = []
        return {
            "id": self.id,
            "project_id": self.project_id,
            "role_name": self.role_name,
            "required_skills": req_skills,
            "is_lead": bool(self.is_lead)
        }


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    synergy_score = Column(Float, default=0.0)
    skill_coverage_pct = Column(Float, default=0.0)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="teams")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    contributions = relationship("Contribution", back_populates="team", cascade="all, delete-orphan")

    def to_dict(self, include_members=True):
        data = {
            "id": self.id,
            "project_id": self.project_id,
            "project_title": self.project.title if self.project else None,
            "name": self.name,
            "synergy_score": float(self.synergy_score or 0.0),
            "skill_coverage_pct": float(self.skill_coverage_pct or 0.0),
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_members:
            data["members"] = [m.to_dict() for m in self.members]
            data["contributions"] = [c.to_dict() for c in self.contributions]
        return data


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    assigned_role = Column(String(100), nullable=False)
    match_score = Column(Float, default=0.0)
    allocated_hours = Column(Integer, default=15)

    team = relationship("Team", back_populates="members")
    student = relationship("Student", back_populates="memberships")

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "student_id": self.student_id,
            "assigned_role": self.assigned_role,
            "match_score": float(self.match_score or 0.0),
            "allocated_hours": self.allocated_hours,
            "student": self.student.to_dict() if self.student else None
        }


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    task_name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False) # Development, Design, Research, Documentation, Testing
    hours_logged = Column(Float, default=0.0)
    impact_rating = Column(Integer, default=5) # 1 to 5
    status = Column(String(30), default="COMPLETED")
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="contributions")
    student = relationship("Student", back_populates="contributions")

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else "Student",
            "task_name": self.task_name,
            "category": self.category,
            "hours_logged": float(self.hours_logged or 0.0),
            "impact_rating": self.impact_rating,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

