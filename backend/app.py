import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import engine, Base, SessionLocal, active_db_type
from models import Student, Skill, StudentSkill, Project, ProjectRole, Team, TeamMember, Contribution
from matcher import calculate_student_role_fit, generate_team_suggestions, compute_team_synergy

app = Flask(__name__)
CORS(app)

# Create database tables
Base.metadata.create_all(bind=engine)

def seed_initial_data(db):
    """Seed campus students and skills if database is empty."""
    if db.query(Student).count() > 0:
        return

    print("Seeding initial campus student dataset...")
    # Seed common skills
    skills_data = [
        ("React", "Frontend"), ("TypeScript", "Frontend"), ("Tailwind CSS", "Frontend"),
        ("Next.js", "Frontend"), ("Vue.js", "Frontend"), ("Python", "Backend"),
        ("Flask", "Backend"), ("Django", "Backend"), ("FastAPI", "Backend"),
        ("Java", "Backend"), ("Spring Boot", "Backend"), ("Node.js", "Backend"),
        ("MySQL", "Database"), ("PostgreSQL", "Database"), ("MongoDB", "Database"),
        ("Docker", "DevOps"), ("Kubernetes", "DevOps"), ("AWS", "DevOps"),
        ("Machine Learning", "AI/ML"), ("Deep Learning", "AI/ML"), ("PyTorch", "AI/ML"),
        ("TensorFlow", "AI/ML"), ("NLP", "AI/ML"), ("Figma", "Design"),
        ("UI/UX Prototyping", "Design"), ("Design Systems", "Design"),
        ("React Native", "Mobile"), ("Flutter", "Mobile"), ("Agile & Scrum", "Management")
    ]
    for name, cat in skills_data:
        db.add(Skill(name=name, category=cat))

    # 15 College Students with rich profiles
    students_data = [
        {
            "roll_no": "CS2023-01", "name": "Aarav Sharma", "email": "aarav.sharma@campus.edu",
            "department": "Computer Science & Engineering", "year": 3, "gpa": 9.40, "merit_score": 94,
            "primary_strength": "Frontend Wizard (React / Next.js / UI)", "availability_status": "AVAILABLE",
            "available_hours_per_week": 24, "bio": "Passionate about crafting ultra-responsive web experiences with React, micro-interactions, and high performance.",
            "github_url": "https://github.com/aarav-sharma", "portfolio_url": "https://aarav.dev",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "past_projects_count": 8, "hackathons_won": 3, "leadership_badge": True,
            "skills": [("React", 5), ("TypeScript", 4), ("Tailwind CSS", 5), ("Next.js", 4), ("Figma", 3)]
        },
        {
            "roll_no": "IT2023-14", "name": "Ananya Iyer", "email": "ananya.iyer@campus.edu",
            "department": "Information Technology", "year": 4, "gpa": 9.65, "merit_score": 96,
            "primary_strength": "Backend Architecture & Distributed Systems", "availability_status": "AVAILABLE",
            "available_hours_per_week": 20, "bio": "Specializes in scalable microservices, relational and caching data tiers using Python, Django, Spring Boot & MySQL.",
            "github_url": "https://github.com/ananya-iyer", "portfolio_url": "https://ananyaiyer.tech",
            "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            "past_projects_count": 10, "hackathons_won": 4, "leadership_badge": True,
            "skills": [("Python", 5), ("Flask", 4), ("Django", 5), ("MySQL", 5), ("Spring Boot", 4), ("Docker", 3)]
        },
        {
            "roll_no": "AI2024-05", "name": "Rohan Verma", "email": "rohan.verma@campus.edu",
            "department": "Artificial Intelligence & Data Science", "year": 3, "gpa": 9.15, "merit_score": 90,
            "primary_strength": "Machine Learning & Deep Learning Specialist", "availability_status": "AVAILABLE",
            "available_hours_per_week": 22, "bio": "Researcher and hacker in LLMs, PyTorch computer vision pipelines, and production inference APIs.",
            "github_url": "https://github.com/rohan-ml", "portfolio_url": "https://rohanverma.ai",
            "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
            "past_projects_count": 6, "hackathons_won": 2, "leadership_badge": False,
            "skills": [("Python", 5), ("Machine Learning", 5), ("PyTorch", 5), ("FastAPI", 4), ("TensorFlow", 4)]
        },
        {
            "roll_no": "DS2023-22", "name": "Priya Nambiar", "email": "priya.nambiar@campus.edu",
            "department": "Computer Science (Design & Media)", "year": 3, "gpa": 8.85, "merit_score": 88,
            "primary_strength": "UI/UX & Product Design Specialist", "availability_status": "AVAILABLE",
            "available_hours_per_week": 18, "bio": "Award-winning Figma UI designer focusing on accessible design tokens, micro-animations, and user-centric flows.",
            "github_url": "https://github.com/priya-ui", "portfolio_url": "https://priyanambiar.design",
            "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
            "past_projects_count": 7, "hackathons_won": 2, "leadership_badge": True,
            "skills": [("Figma", 5), ("UI/UX Prototyping", 5), ("Design Systems", 5), ("React", 3), ("Tailwind CSS", 4)]
        },
        {
            "roll_no": "CS2022-89", "name": "Kavya Deshmukh", "email": "kavya.d@campus.edu",
            "department": "Computer Science & Engineering", "year": 4, "gpa": 9.30, "merit_score": 92,
            "primary_strength": "Full-Stack Engineer & Cloud Deployments", "availability_status": "AVAILABLE",
            "available_hours_per_week": 25, "bio": "End-to-end full stack builder with React, Node/Express, MySQL, Docker, and CI/CD pipelines.",
            "github_url": "https://github.com/kavya-cloud", "portfolio_url": "https://kavyadeshmukh.com",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "past_projects_count": 11, "hackathons_won": 3, "leadership_badge": True,
            "skills": [("React", 5), ("Node.js", 5), ("MySQL", 4), ("Docker", 4), ("TypeScript", 4)]
        },
        {
            "roll_no": "ECE2023-33", "name": "Vikramaditya Rao", "email": "vikram.rao@campus.edu",
            "department": "Electronics & Communication", "year": 3, "gpa": 8.40, "merit_score": 82,
            "primary_strength": "DevOps & Cloud Infrastructure", "availability_status": "AVAILABLE",
            "available_hours_per_week": 20, "bio": "Enthusiast for Kubernetes clusters, Dockerized container orchestration, and AWS cloud deployment.",
            "github_url": "https://github.com/vikram-ops", "portfolio_url": "https://vikramrao.cloud",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            "past_projects_count": 5, "hackathons_won": 1, "leadership_badge": False,
            "skills": [("Docker", 5), ("Kubernetes", 4), ("AWS", 4), ("Python", 3)]
        },
        {
            "roll_no": "CS2024-11", "name": "Sneha Kulkarni", "email": "sneha.k@campus.edu",
            "department": "Computer Science & Engineering", "year": 2, "gpa": 8.70, "merit_score": 84,
            "primary_strength": "Frontend Wizard (React / Next.js / UI)", "availability_status": "AVAILABLE",
            "available_hours_per_week": 18, "bio": "Frontend enthusiast specializing in React, TypeScript, Tailwind CSS, and interactive state management.",
            "github_url": "https://github.com/sneha-codes", "portfolio_url": "https://snehak.dev",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
            "past_projects_count": 4, "hackathons_won": 1, "leadership_badge": False,
            "skills": [("React", 4), ("Tailwind CSS", 4), ("TypeScript", 3), ("Figma", 3)]
        },
        {
            "roll_no": "IT2023-55", "name": "Devansh Mehta", "email": "devansh.m@campus.edu",
            "department": "Information Technology", "year": 3, "gpa": 8.90, "merit_score": 87,
            "primary_strength": "Backend Architecture & Distributed Systems", "availability_status": "AVAILABLE",
            "available_hours_per_week": 22, "bio": "Database optimization expert in MySQL, query profiling, Spring Boot, and REST API architectural patterns.",
            "github_url": "https://github.com/devansh-m", "portfolio_url": "https://devanshmehta.io",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            "past_projects_count": 7, "hackathons_won": 2, "leadership_badge": False,
            "skills": [("Java", 5), ("Spring Boot", 4), ("MySQL", 5), ("Python", 4)]
        },
        {
            "roll_no": "AI2023-09", "name": "Tanvi Saxena", "email": "tanvi.saxena@campus.edu",
            "department": "Artificial Intelligence & Data Science", "year": 3, "gpa": 9.25, "merit_score": 91,
            "primary_strength": "Machine Learning & Deep Learning Specialist", "availability_status": "LIMITED",
            "available_hours_per_week": 12, "bio": "NLP researcher fine-tuning Transformers, building RAG systems, and integrating FastAPI model endpoints.",
            "github_url": "https://github.com/tanvi-nlp", "portfolio_url": "https://tanvisaxena.com",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            "past_projects_count": 6, "hackathons_won": 2, "leadership_badge": False,
            "skills": [("Python", 5), ("NLP", 5), ("PyTorch", 4), ("FastAPI", 3)]
        },
        {
            "roll_no": "SE2022-04", "name": "Arjun Patel", "email": "arjun.patel@campus.edu",
            "department": "Software Engineering", "year": 4, "gpa": 9.50, "merit_score": 95,
            "primary_strength": "Full-Stack Engineer & Cloud Deployments", "availability_status": "AVAILABLE",
            "available_hours_per_week": 26, "bio": "Team captain and full-stack veteran. Built 4 production college enterprise tools using React, Flask, and MySQL.",
            "github_url": "https://github.com/arjun-patel", "portfolio_url": "https://arjunpatel.pro",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
            "past_projects_count": 12, "hackathons_won": 5, "leadership_badge": True,
            "skills": [("React", 5), ("Python", 5), ("Flask", 5), ("MySQL", 5), ("Docker", 4), ("Agile & Scrum", 5)]
        },
        {
            "roll_no": "CS2024-44", "name": "Meera Nair", "email": "meera.nair@campus.edu",
            "department": "Computer Science & Engineering", "year": 2, "gpa": 8.60, "merit_score": 81,
            "primary_strength": "UI/UX & Product Design Specialist", "availability_status": "AVAILABLE",
            "available_hours_per_week": 20, "bio": "Focusing on wireframing, user persona mapping, interactive design prototypes, and frontend HTML/CSS styling.",
            "github_url": "https://github.com/meera-design", "portfolio_url": "https://meeranair.design",
            "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
            "past_projects_count": 4, "hackathons_won": 1, "leadership_badge": False,
            "skills": [("Figma", 4), ("UI/UX Prototyping", 4), ("Tailwind CSS", 3)]
        },
        {
            "roll_no": "IT2024-18", "name": "Karthik Raja", "email": "karthik.raja@campus.edu",
            "department": "Information Technology", "year": 2, "gpa": 8.10, "merit_score": 78,
            "primary_strength": "Mobile App Specialist (React Native & Flutter)", "availability_status": "AVAILABLE",
            "available_hours_per_week": 22, "bio": "Cross-platform mobile developer with React Native, Flutter, and MySQL backend integrations.",
            "github_url": "https://github.com/karthik-mobile", "portfolio_url": "https://karthik.tech",
            "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
            "past_projects_count": 5, "hackathons_won": 1, "leadership_badge": False,
            "skills": [("React Native", 5), ("Flutter", 4), ("React", 4)]
        },
        {
            "roll_no": "DS2023-08", "name": "Ishita Banerji", "email": "ishita.b@campus.edu",
            "department": "Data Science", "year": 3, "gpa": 9.05, "merit_score": 89,
            "primary_strength": "Data Analytics & Machine Learning", "availability_status": "AVAILABLE",
            "available_hours_per_week": 20, "bio": "Extracts insights from large data sets using Python, Pandas, MySQL, and statistical testing.",
            "github_url": "https://github.com/ishita-ds", "portfolio_url": "https://ishitabanerji.com",
            "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
            "past_projects_count": 6, "hackathons_won": 2, "leadership_badge": False,
            "skills": [("Python", 5), ("MySQL", 4), ("Machine Learning", 4)]
        },
        {
            "roll_no": "CS2023-77", "name": "Farhan Qureshi", "email": "farhan.q@campus.edu",
            "department": "Computer Science & Engineering", "year": 3, "gpa": 7.90, "merit_score": 74,
            "primary_strength": "Backend Architecture & Distributed Systems", "availability_status": "BUSY",
            "available_hours_per_week": 8, "bio": "Backend developer working on legacy systems, currently finishing capstone research milestone.",
            "github_url": "https://github.com/farhan-q", "portfolio_url": "https://farhan.org",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
            "past_projects_count": 3, "hackathons_won": 0, "leadership_badge": False,
            "skills": [("Java", 4), ("MySQL", 3), ("Spring Boot", 3)]
        },
        {
            "roll_no": "SE2023-19", "name": "Rhea Singhania", "email": "rhea.s@campus.edu",
            "department": "Software Engineering", "year": 3, "gpa": 9.35, "merit_score": 93,
            "primary_strength": "Full-Stack Engineer & Cloud Deployments", "availability_status": "AVAILABLE",
            "available_hours_per_week": 24, "bio": "Full-stack builder with expertise in React, Java Spring Boot, Python Flask, MySQL, and CI/CD.",
            "github_url": "https://github.com/rhea-singh", "portfolio_url": "https://rheasinghania.tech",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
            "past_projects_count": 9, "hackathons_won": 3, "leadership_badge": True,
            "skills": [("React", 5), ("Java", 4), ("Spring Boot", 4), ("MySQL", 5), ("Python", 4)]
        }
    ]

    for s_info in students_data:
        skills = s_info.pop("skills")
        st = Student(**s_info)
        db.add(st)
        db.flush()
        for s_name, lvl in skills:
            sk = StudentSkill(student_id=st.id, skill_name=s_name, proficiency_level=lvl)
            db.add(sk)

    # Seed an exemplary Project
    sample_proj = Project(
        title="Campus Health & Wellness AI Portal",
        domain="AI / Healthcare & Web SaaS",
        description="A full-stack predictive portal helping students monitor mental health, track nutritional wellness, and consult campus counselors with end-to-end encryption.",
        team_size=4,
        min_gpa=7.50,
        min_hours_per_week=15,
        duration_weeks=10,
        status="PLANNING"
    )
    db.add(sample_proj)
    db.flush()

    roles_data = [
        {
            "role_name": "Frontend Lead",
            "required_skills": json.dumps([{"skill": "React", "min_level": 4, "weight": 5}, {"skill": "Tailwind CSS", "min_level": 3, "weight": 3}]),
            "is_lead": True
        },
        {
            "role_name": "Backend Architect",
            "required_skills": json.dumps([{"skill": "Python", "min_level": 4, "weight": 5}, {"skill": "MySQL", "min_level": 4, "weight": 4}, {"skill": "Flask", "min_level": 3, "weight": 3}]),
            "is_lead": False
        },
        {
            "role_name": "AI/ML Engineer",
            "required_skills": json.dumps([{"skill": "Machine Learning", "min_level": 4, "weight": 5}, {"skill": "Python", "min_level": 4, "weight": 4}, {"skill": "PyTorch", "min_level": 3, "weight": 3}]),
            "is_lead": False
        },
        {
            "role_name": "UI/UX & Product Designer",
            "required_skills": json.dumps([{"skill": "Figma", "min_level": 4, "weight": 5}, {"skill": "UI/UX Prototyping", "min_level": 4, "weight": 4}]),
            "is_lead": False
        }
    ]
    for r in roles_data:
        pr = ProjectRole(project_id=sample_proj.id, role_name=r["role_name"], required_skills=r["required_skills"], is_lead=r["is_lead"])
        db.add(pr)

    db.commit()
    print("Seed complete! Added 15 students and 1 sample project.")

# Initialize database seed
with SessionLocal() as db_session:
    seed_initial_data(db_session)

# ==================== SYSTEM HEALTH ====================
@app.route("/api/health", methods=["GET"])
def health():
    db = SessionLocal()
    try:
        student_count = db.query(Student).count()
        project_count = db.query(Project).count()
        team_count = db.query(Team).count()
        return jsonify({
            "status": "healthy",
            "database_type": active_db_type,
            "metrics": {
                "total_students": student_count,
                "total_projects": project_count,
                "total_teams_formed": team_count
            }
        })
    finally:
        db.close()

# ==================== STEP 1: STUDENT PROFILE ====================
@app.route("/api/students", methods=["GET"])
def get_students():
    db = SessionLocal()
    try:
        search = request.args.get("search", "").strip()
        availability = request.args.get("availability", "").strip()
        dept = request.args.get("department", "").strip()
        strength = request.args.get("strength", "").strip()
        min_gpa = request.args.get("min_gpa", type=float)

        query = db.query(Student)

        if search:
            query = query.filter(
                (Student.name.ilike(f"%{search}%")) |
                (Student.roll_no.ilike(f"%{search}%")) |
                (Student.primary_strength.ilike(f"%{search}%"))
            )
        if availability:
            query = query.filter(Student.availability_status == availability)
        if dept:
            query = query.filter(Student.department == dept)
        if strength:
            query = query.filter(Student.primary_strength.ilike(f"%{strength}%"))
        if min_gpa is not None:
            query = query.filter(Student.gpa >= min_gpa)

        students = query.order_by(Student.merit_score.desc()).all()
        return jsonify([s.to_dict() for s in students])
    finally:
        db.close()

@app.route("/api/students/<int:student_id>", methods=["GET"])
def get_student(student_id):
    db = SessionLocal()
    try:
        s = db.query(Student).filter(Student.id == student_id).first()
        if not s:
            return jsonify({"error": "Student not found"}), 404
        return jsonify(s.to_dict())
    finally:
        db.close()

@app.route("/api/students", methods=["POST"])
def create_student():
    data = request.json or {}
    db = SessionLocal()
    try:
        skills = data.pop("skills", [])
        student = Student(
            roll_no=data.get("roll_no"),
            name=data.get("name"),
            email=data.get("email"),
            department=data.get("department"),
            year=int(data.get("year", 1)),
            gpa=float(data.get("gpa", 8.0)),
            merit_score=int(data.get("merit_score", 75)),
            primary_strength=data.get("primary_strength", "Full-Stack Developer"),
            availability_status=data.get("availability_status", "AVAILABLE"),
            available_hours_per_week=int(data.get("available_hours_per_week", 15)),
            bio=data.get("bio", ""),
            github_url=data.get("github_url", ""),
            portfolio_url=data.get("portfolio_url", ""),
            avatar=data.get("avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
            past_projects_count=int(data.get("past_projects_count", 0)),
            hackathons_won=int(data.get("hackathons_won", 0)),
            leadership_badge=bool(data.get("leadership_badge", False))
        )
        db.add(student)
        db.flush()

        for sk in skills:
            name = sk.get("skill_name") or sk.get("name")
            level = int(sk.get("proficiency_level", 3))
            if name:
                db.add(StudentSkill(student_id=student.id, skill_name=name, proficiency_level=level))

        db.commit()
        return jsonify(student.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.json or {}
    db = SessionLocal()
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        for field in ["name", "email", "department", "primary_strength", "availability_status", "bio", "github_url", "portfolio_url", "avatar"]:
            if field in data:
                setattr(student, field, data[field])

        if "year" in data: student.year = int(data["year"])
        if "gpa" in data: student.gpa = float(data["gpa"])
        if "merit_score" in data: student.merit_score = int(data["merit_score"])
        if "available_hours_per_week" in data: student.available_hours_per_week = int(data["available_hours_per_week"])
        if "past_projects_count" in data: student.past_projects_count = int(data["past_projects_count"])
        if "hackathons_won" in data: student.hackathons_won = int(data["hackathons_won"])
        if "leadership_badge" in data: student.leadership_badge = bool(data["leadership_badge"])

        if "skills" in data:
            db.query(StudentSkill).filter(StudentSkill.student_id == student_id).delete()
            for sk in data["skills"]:
                name = sk.get("skill_name") or sk.get("name")
                level = int(sk.get("proficiency_level", 3))
                if name:
                    db.add(StudentSkill(student_id=student.id, skill_name=name, proficiency_level=level))

        db.commit()
        return jsonify(student.to_dict())
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    db = SessionLocal()
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404
        db.delete(student)
        db.commit()
        return jsonify({"message": f"Student {student_id} deleted successfully"})
    finally:
        db.close()

# ==================== STUDENT GMAIL AUTH & AVAILABILITY ====================
@app.route("/api/students/login-gmail", methods=["POST"])
def login_with_gmail():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    auto_create = data.get("auto_create", False)

    if not email:
        return jsonify({"error": "Gmail address is required"}), 400

    db = SessionLocal()
    try:
        student = db.query(Student).filter(Student.email.ilike(email)).first()
        if not student:
            # Check if auto-create is requested or student signs in with new Gmail
            if auto_create:
                name_part = email.split("@")[0].replace(".", " ").title()
                roll_no = f"CS2024-{db.query(Student).count() + 101}"
                student = Student(
                    roll_no=roll_no,
                    name=name_part,
                    email=email,
                    department="Computer Science & Engineering",
                    year=3,
                    gpa=8.8,
                    merit_score=85,
                    primary_strength="Full-Stack Engineer & Cloud Deployments",
                    availability_status="AVAILABLE",
                    available_hours_per_week=20,
                    bio=f"Student profile authenticated via Google Gmail ({email}). Ready for campus team assignments.",
                    avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                    past_projects_count=4,
                    hackathons_won=1,
                    leadership_badge=True
                )
                db.add(student)
                db.flush()
                # Default skills
                db.add(StudentSkill(student_id=student.id, skill_name="React", proficiency_level=4))
                db.add(StudentSkill(student_id=student.id, skill_name="Python", proficiency_level=4))
                db.add(StudentSkill(student_id=student.id, skill_name="MySQL", proficiency_level=4))
                db.commit()
            else:
                return jsonify({
                    "error": f"No student account found for Gmail '{email}'.",
                    "registered_emails": [s.email for s in db.query(Student).limit(6).all()]
                }), 404

        return jsonify({
            "message": "Gmail login successful",
            "student": student.to_dict()
        })
    finally:
        db.close()

@app.route("/api/students/availability-gmail", methods=["POST"])
def update_availability_via_gmail():
    """Update student availability using their authenticated Gmail"""
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    student_id = data.get("student_id")
    status = data.get("availability_status", "AVAILABLE")
    hours = data.get("available_hours_per_week")

    if not email and not student_id:
        return jsonify({"error": "Student email or ID is required"}), 400

    db = SessionLocal()
    try:
        query = db.query(Student)
        if student_id:
            student = query.filter(Student.id == student_id).first()
        else:
            student = query.filter(Student.email.ilike(email)).first()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        if status:
            student.availability_status = status.upper()
        if hours is not None:
            student.available_hours_per_week = int(hours)

        db.commit()
        return jsonify({
            "message": f"Availability successfully updated via Gmail ({student.email})!",
            "student": student.to_dict()
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route("/api/students/<int:student_id>/availability", methods=["PUT"])
def update_student_availability_direct(student_id):
    data = request.json or {}
    db = SessionLocal()
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        if "availability_status" in data:
            student.availability_status = data["availability_status"].upper()
        if "available_hours_per_week" in data:
            student.available_hours_per_week = int(data["available_hours_per_week"])

        db.commit()
        return jsonify({
            "message": "Availability updated successfully",
            "student": student.to_dict()
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

# ==================== STEP 2: PROJECT REQUIREMENT ====================
@app.route("/api/projects", methods=["GET"])
def get_projects():
    db = SessionLocal()
    try:
        projects = db.query(Project).order_by(Project.created_at.desc()).all()
        return jsonify([p.to_dict() for p in projects])
    finally:
        db.close()

@app.route("/api/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(project.to_dict())
    finally:
        db.close()

@app.route("/api/projects", methods=["POST"])
def create_project():
    data = request.json or {}
    db = SessionLocal()
    try:
        roles_data = data.pop("roles", [])
        project = Project(
            title=data.get("title", "Campus Project"),
            domain=data.get("domain", "Web Application"),
            description=data.get("description", ""),
            team_size=int(data.get("team_size", len(roles_data) or 4)),
            min_gpa=float(data.get("min_gpa", 7.0)),
            min_hours_per_week=int(data.get("min_hours_per_week", 12)),
            duration_weeks=int(data.get("duration_weeks", 8)),
            status="PLANNING"
        )
        db.add(project)
        db.flush()

        for r in roles_data:
            req_skills = r.get("required_skills", [])
            req_skills_json = json.dumps(req_skills) if isinstance(req_skills, list) else req_skills
            role = ProjectRole(
                project_id=project.id,
                role_name=r.get("role_name", "Developer"),
                required_skills=req_skills_json,
                is_lead=bool(r.get("is_lead", False))
            )
            db.add(role)

        db.commit()
        return jsonify(project.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

# ==================== STEP 3: SKILL MATCH ====================
@app.route("/api/projects/<int:project_id>/match", methods=["GET"])
def match_candidates(project_id):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({"error": "Project not found"}), 404

        students = db.query(Student).all()
        student_dicts = [s.to_dict() for s in students]
        roles_dicts = [r.to_dict() for r in project.roles]

        results = []
        for s in student_dicts:
            role_evaluations = []
            best_fit_score = 0
            best_role = None

            for r in roles_dicts:
                fit = calculate_student_role_fit(s, r, project.min_hours_per_week, project.min_gpa)
                role_evaluations.append(fit)
                if fit["overall_fit"] > best_fit_score:
                    best_fit_score = fit["overall_fit"]
                    best_role = r["role_name"]

            results.append({
                "student": s,
                "best_role": best_role,
                "highest_match_score": best_fit_score,
                "role_breakdown": role_evaluations
            })

        # Sort students by highest match score
        results.sort(key=lambda x: x["highest_match_score"], reverse=True)
        return jsonify({
            "project": project.to_dict(),
            "candidate_matches": results
        })
    finally:
        db.close()

# ==================== STEP 4: TEAM SUGGESTIONS & FORMATION ====================
@app.route("/api/projects/<int:project_id>/team-suggestions", methods=["GET"])
def get_team_suggestions_endpoint(project_id):
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({"error": "Project not found"}), 404

        all_students = [s.to_dict() for s in db.query(Student).all()]
        suggestions = generate_team_suggestions(project.to_dict(), all_students)

        return jsonify({
            "project_id": project.id,
            "project_title": project.title,
            "suggestions": suggestions
        })
    finally:
        db.close()

@app.route("/api/teams", methods=["POST"])
def form_team():
    data = request.json or {}
    db = SessionLocal()
    try:
        project_id = data.get("project_id")
        team_name = data.get("team_name", "Formed Project Team")
        members_data = data.get("members", [])

        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return jsonify({"error": "Project not found"}), 404

        team = Team(
            project_id=project_id,
            name=team_name,
            synergy_score=float(data.get("synergy_score", 85.0)),
            skill_coverage_pct=float(data.get("skill_coverage_pct", 90.0)),
            status="ACTIVE"
        )
        db.add(team)
        db.flush()

        # Add team members
        for m in members_data:
            tm = TeamMember(
                team_id=team.id,
                student_id=m.get("student_id"),
                assigned_role=m.get("assigned_role", "Contributor"),
                match_score=float(m.get("match_score", 80.0)),
                allocated_hours=int(m.get("allocated_hours", 15))
            )
            db.add(tm)

        # Seed initial milestone contributions to jumpstart Step 5 report
        sample_contributions = [
            ("System Architecture & Database Schema Design", "Development", 8.0, 5),
            ("Interactive Wireframes & Component Tokens in Figma", "Design", 6.5, 4),
            ("Core REST API endpoints & Service Layer with Tests", "Development", 9.0, 5),
            ("Initial Model Exploration & Data Preprocessing Pipeline", "Research", 7.5, 4),
            ("Sprint Setup, Task Breakdown & CI/CD Initial Workflow", "Documentation", 4.0, 5)
        ]

        for i, m in enumerate(members_data):
            c_idx = i % len(sample_contributions)
            task_title, cat, hrs, rating = sample_contributions[c_idx]
            contrib = Contribution(
                team_id=team.id,
                student_id=m.get("student_id"),
                task_name=f"{task_title} ({m.get('assigned_role')})",
                category=cat,
                hours_logged=hrs,
                impact_rating=rating,
                status="COMPLETED"
            )
            db.add(contrib)

        project.status = "TEAM_FORMED"
        db.commit()
        return jsonify(team.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route("/api/teams", methods=["GET"])
def get_teams():
    db = SessionLocal()
    try:
        teams = db.query(Team).order_by(Team.created_at.desc()).all()
        return jsonify([t.to_dict(include_members=True) for t in teams])
    finally:
        db.close()

@app.route("/api/teams/<int:team_id>", methods=["GET"])
def get_team(team_id):
    db = SessionLocal()
    try:
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404
        return jsonify(team.to_dict(include_members=True))
    finally:
        db.close()

# ==================== STEP 5: CONTRIBUTION REPORT ====================
@app.route("/api/teams/<int:team_id>/contributions", methods=["POST"])
def add_contribution(team_id):
    data = request.json or {}
    db = SessionLocal()
    try:
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404

        contrib = Contribution(
            team_id=team_id,
            student_id=data.get("student_id"),
            task_name=data.get("task_name"),
            category=data.get("category", "Development"),
            hours_logged=float(data.get("hours_logged", 2.0)),
            impact_rating=int(data.get("impact_rating", 5)),
            status=data.get("status", "COMPLETED")
        )
        db.add(contrib)
        db.commit()
        return jsonify(contrib.to_dict()), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route("/api/teams/<int:team_id>/report", methods=["GET"])
def get_team_contribution_report(team_id):
    db = SessionLocal()
    try:
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            return jsonify({"error": "Team not found"}), 404

        team_dict = team.to_dict(include_members=True)
        members = team_dict.get("members", [])
        contributions = team_dict.get("contributions", [])

        # Calculate per-student metrics
        member_stats = []
        total_team_hours = sum(c.get("hours_logged", 0.0) for c in contributions)

        for m in members:
            student = m.get("student", {})
            s_id = student.get("id")
            s_contribs = [c for c in contributions if c.get("student_id") == s_id]
            s_hours = sum(c.get("hours_logged", 0.0) for c in s_contribs)
            s_impact = (
                sum(c.get("impact_rating", 5) for c in s_contribs) / len(s_contribs)
                if s_contribs else 5.0
            )

            pct_workload = round((s_hours / max(total_team_hours, 1.0)) * 100.0, 1) if total_team_hours > 0 else 0.0

            member_stats.append({
                "student_id": s_id,
                "name": student.get("name"),
                "roll_no": student.get("roll_no"),
                "role": m.get("assigned_role"),
                "primary_strength": student.get("primary_strength"),
                "tasks_count": len(s_contribs),
                "total_hours": round(s_hours, 1),
                "workload_share_pct": pct_workload,
                "avg_impact_rating": round(s_impact, 1),
                "match_score": m.get("match_score"),
                "skills": student.get("skills", [])
            })

        # Category distribution
        categories = {}
        for c in contributions:
            cat = c.get("category", "General")
            categories[cat] = categories.get(cat, 0.0) + c.get("hours_logged", 0.0)

        return jsonify({
            "team_id": team.id,
            "team_name": team.name,
            "project_title": team.project.title if team.project else "Project",
            "synergy_score": team.synergy_score,
            "skill_coverage_pct": team.skill_coverage_pct,
            "total_team_hours": round(total_team_hours, 1),
            "member_stats": member_stats,
            "category_hours": categories,
            "recent_contributions": contributions,
            "status": team.status
        })
    finally:
        db.close()

# ==================== SKILLS CATALOG ====================
@app.route("/api/skills", methods=["GET"])
def get_skills():
    db = SessionLocal()
    try:
        skills = db.query(Skill).all()
        return jsonify([s.to_dict() for s in skills])
    finally:
        db.close()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Campus-Synapse Backend running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)

