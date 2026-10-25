"""
Intelligent Campus Project Team Formation & Synergy Engine
Computes multidimensional candidate compatibility and team synergy scores.
"""

def normalize_text(text: str) -> str:
    return (text or "").lower().strip()

def calculate_student_role_fit(student, role, min_project_hours=12, min_project_gpa=6.5):
    """
    Evaluates how well a single student fits a specific project role.
    Returns composite score (0-100) and structured matching breakdown.
    """
    req_skills = role.get("required_skills", [])
    student_skills_map = {
        normalize_text(s.get("skill_name", "")): s.get("proficiency_level", 1)
        for s in student.get("skills", [])
    }

    matched_skills = []
    missing_skills = []
    total_skill_weight = 0
    accumulated_skill_score = 0

    if not req_skills:
        skill_score = 75.0 # Baseline if no specific skills specified
    else:
        for req in req_skills:
            s_name = req.get("skill", "")
            norm_name = normalize_text(s_name)
            min_lvl = req.get("min_level", 2)
            weight = req.get("weight", 3)
            total_skill_weight += weight

            student_lvl = student_skills_map.get(norm_name, 0)
            if student_lvl >= min_lvl:
                match_pct = 1.0
                matched_skills.append({
                    "skill": s_name,
                    "student_level": student_lvl,
                    "required_level": min_lvl,
                    "met": True
                })
            elif student_lvl > 0:
                match_pct = student_lvl / float(min_lvl)
                matched_skills.append({
                    "skill": s_name,
                    "student_level": student_lvl,
                    "required_level": min_lvl,
                    "met": False
                })
            else:
                match_pct = 0.0
                missing_skills.append({
                    "skill": s_name,
                    "required_level": min_lvl
                })

            accumulated_skill_score += match_pct * weight

        skill_score = (accumulated_skill_score / total_skill_weight) * 100 if total_skill_weight > 0 else 70.0

    # 2. Availability Score Calculation
    avail_status = student.get("availability_status", "AVAILABLE")
    avail_hours = student.get("available_hours_per_week", 15)

    if avail_status == "BUSY":
        avail_score = 25.0
    elif avail_status == "LIMITED":
        avail_score = min(65.0, (avail_hours / max(min_project_hours, 1)) * 50.0)
    else: # AVAILABLE
        if avail_hours >= min_project_hours:
            bonus = min(20.0, (avail_hours - min_project_hours) * 2.0)
            avail_score = min(100.0, 80.0 + bonus)
        else:
            avail_score = (avail_hours / max(min_project_hours, 1)) * 75.0

    # 3. Merit, GPA & Primary Strength Alignment
    merit_raw = student.get("merit_score", 50)
    gpa = student.get("gpa", 7.0)
    primary_strength = normalize_text(student.get("primary_strength", ""))
    role_name = normalize_text(role.get("role_name", ""))

    strength_boost = 0.0
    # Check if primary strength contains keywords matching the role
    role_keywords = role_name.replace("&", " ").replace("/", " ").split()
    for kw in role_keywords:
        if len(kw) > 3 and kw in primary_strength:
            strength_boost += 15.0
            break

    if student.get("leadership_badge") and role.get("is_lead"):
        strength_boost += 10.0

    gpa_factor = min(100.0, (gpa / 10.0) * 100.0 if gpa > 4.0 else (gpa / 4.0) * 100.0)
    merit_combined = (merit_raw * 0.5) + (gpa_factor * 0.3) + strength_boost
    merit_score = min(100.0, max(40.0, merit_combined))

    # Composite fit score
    composite = (skill_score * 0.55) + (avail_score * 0.25) + (merit_score * 0.20)
    composite = round(min(100.0, max(10.0, composite)), 1)

    return {
        "student_id": student.get("id"),
        "role_name": role.get("role_name"),
        "overall_fit": composite,
        "skill_score": round(skill_score, 1),
        "availability_score": round(avail_score, 1),
        "merit_score": round(merit_score, 1),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "is_lead": role.get("is_lead", False)
    }


def compute_team_synergy(team_members, project_roles, project_skills_all):
    """
    Computes overall team synergy score (0-100), technical coverage,
    and availability metrics.
    """
    if not team_members:
        return 0.0, 0.0, 0

    total_match = sum(m.get("match_score", 0) for m in team_members)
    avg_match = total_match / len(team_members)

    # Collect all skills possessed by team
    team_skills_set = set()
    total_hours = 0
    for m in team_members:
        s = m.get("student", {})
        total_hours += s.get("available_hours_per_week", 15)
        for sk in s.get("skills", []):
            if sk.get("proficiency_level", 0) >= 3:
                team_skills_set.add(normalize_text(sk.get("skill_name", "")))

    # Compute skill coverage
    if project_skills_all:
        covered = sum(1 for req in project_skills_all if normalize_text(req) in team_skills_set)
        coverage_pct = round((covered / len(project_skills_all)) * 100.0, 1)
    else:
        coverage_pct = 90.0

    # Role completeness
    assigned_roles = {m.get("assigned_role") for m in team_members}
    required_role_names = {r.get("role_name") for r in project_roles}
    role_coverage = (len(assigned_roles.intersection(required_role_names)) / max(len(required_role_names), 1)) * 100.0

    synergy = (avg_match * 0.45) + (coverage_pct * 0.35) + (role_coverage * 0.20)
    synergy = round(min(99.5, max(20.0, synergy)), 1)

    return synergy, coverage_pct, total_hours


def generate_team_suggestions(project, all_students):
    """
    Generates 3 distinct smart team compositions:
    1. 'Optimal Balanced Team' (Top synergy & role fitness)
    2. 'High-Merit Vanguard' (Prioritizes merit, hackathons & past projects)
    3. 'High-Availability Sprint' (Maximizes weekly time dedication)
    """
    roles = project.get("roles", [])
    if not roles:
        return []

    # Extract all distinct required skills for coverage calculation
    all_req_skills = set()
    for r in roles:
        for sk in r.get("required_skills", []):
            all_req_skills.add(sk.get("skill"))

    min_hours = project.get("min_hours_per_week", 12)
    min_gpa = project.get("min_gpa", 6.5)

    # Helper to build a candidate evaluation matrix
    def build_matrix(weight_bias="balanced"):
        matrix = []
        for student in all_students:
            for role in roles:
                fit = calculate_student_role_fit(student, role, min_hours, min_gpa)
                score = fit["overall_fit"]

                if weight_bias == "merit":
                    # Boost by merit and hackathons
                    score = (score * 0.5) + (student.get("merit_score", 50) * 0.3) + (min(20, student.get("hackathons_won", 0) * 5))
                elif weight_bias == "availability":
                    # Boost by weekly free hours
                    score = (score * 0.5) + (min(40, student.get("available_hours_per_week", 15) * 1.5)) + (fit["availability_score"] * 0.2)

                matrix.append({
                    "student": student,
                    "role": role,
                    "score": round(score, 1),
                    "fit": fit
                })
        return matrix

    configurations = [
        ("Optimal Balanced Team", "balanced", "Maximizes overall technical skill coverage and role alignment"),
        ("High-Merit Vanguard", "merit", "Selected for high academic merit, hackathon wins, and proven leadership"),
        ("Rapid-Sprint Availability", "availability", "Optimized for maximum bandwidth and weekly hours dedication")
    ]

    suggestions = []

    for name, bias, desc in configurations:
        matrix = build_matrix(bias)
        # Sort by candidate score descending
        matrix.sort(key=lambda x: x["score"], reverse=True)

        assigned_students = set()
        assigned_roles = set()
        chosen_members = []

        # First pass: assign best candidate for each unique role
        for role in roles:
            role_name = role.get("role_name")
            candidates_for_role = [
                item for item in matrix
                if item["role"]["role_name"] == role_name and item["student"]["id"] not in assigned_students
            ]
            if candidates_for_role:
                best = candidates_for_role[0]
                assigned_students.add(best["student"]["id"])
                assigned_roles.add(role_name)
                chosen_members.append({
                    "student_id": best["student"]["id"],
                    "student": best["student"],
                    "assigned_role": role_name,
                    "match_score": best["fit"]["overall_fit"],
                    "allocated_hours": min(20, best["student"].get("available_hours_per_week", 15)),
                    "fit_details": best["fit"]
                })

        # Calculate metrics
        synergy, coverage, total_hours = compute_team_synergy(chosen_members, roles, all_req_skills)

        suggestions.append({
            "suggestion_id": bias,
            "team_name": f"{name} - {project.get('title', 'Project')[:20]}",
            "tag": name,
            "description": desc,
            "synergy_score": synergy,
            "skill_coverage_pct": coverage,
            "total_weekly_hours": total_hours,
            "members": chosen_members
        })

    return suggestions

