-- ===============================================================
-- SMART CAMPUS PROJECT TEAM FORMATION SYSTEM (CAMPUS-SYNAPSE)
-- Database: MySQL
-- ===============================================================

CREATE DATABASE IF NOT EXISTS campus_teams_db;
USE campus_teams_db;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    gpa DECIMAL(3,2) NOT NULL,
    merit_score INT NOT NULL DEFAULT 50, -- 0 to 100 based on achievements & track record
    primary_strength VARCHAR(100) NOT NULL, -- What the student is best at
    availability_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'LIMITED', 'BUSY'
    available_hours_per_week INT NOT NULL DEFAULT 15,
    bio TEXT,
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    avatar VARCHAR(255),
    past_projects_count INT DEFAULT 0,
    hackathons_won INT DEFAULT 0,
    leadership_badge BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Skills Catalog
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- 3. Student Skills Mapping with Proficiency (1 to 5)
CREATE TABLE IF NOT EXISTS student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    skill_name VARCHAR(80) NOT NULL,
    proficiency_level INT NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
    years_experience DECIMAL(3,1) DEFAULT 1.0,
    verified_merit BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    description TEXT,
    team_size INT NOT NULL DEFAULT 4,
    min_gpa DECIMAL(3,2) DEFAULT 6.50,
    min_hours_per_week INT NOT NULL DEFAULT 12,
    duration_weeks INT DEFAULT 8,
    status VARCHAR(50) DEFAULT 'PLANNING', -- 'PLANNING', 'TEAM_FORMED', 'IN_PROGRESS', 'COMPLETED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Project Roles and Required Skills
CREATE TABLE IF NOT EXISTS project_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    required_skills JSON NOT NULL, -- list of { skill: string, min_level: int, weight: int }
    is_lead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 6. Formed Teams
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    synergy_score DECIMAL(5,2) DEFAULT 0.0,
    skill_coverage_pct DECIMAL(5,2) DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 7. Team Members Assignment
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    student_id INT NOT NULL,
    assigned_role VARCHAR(100) NOT NULL,
    match_score DECIMAL(5,2) NOT NULL,
    allocated_hours INT DEFAULT 15,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Contribution Tracking & Reports
CREATE TABLE IF NOT EXISTS contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    student_id INT NOT NULL,
    task_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Development, Design, Research, Testing, Documentation
    hours_logged DECIMAL(4,1) DEFAULT 0.0,
    impact_rating INT DEFAULT 5 CHECK (impact_rating BETWEEN 1 AND 5),
    status VARCHAR(30) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

