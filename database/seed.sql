-- ===============================================================
-- CAMPUS-SYNAPSE SEED DATA (College Students & Skills)
-- ===============================================================

USE campus_teams_db;

-- Clear previous data if needed
DELETE FROM contributions;
DELETE FROM team_members;
DELETE FROM teams;
DELETE FROM project_roles;
DELETE FROM projects;
DELETE FROM student_skills;
DELETE FROM students;
DELETE FROM skills;

-- Insert Base Skills
INSERT INTO skills (name, category) VALUES
('React', 'Frontend'),
('TypeScript', 'Frontend'),
('Tailwind CSS', 'Frontend'),
('Next.js', 'Frontend'),
('Vue.js', 'Frontend'),
('Python', 'Backend'),
('Flask', 'Backend'),
('Django', 'Backend'),
('FastAPI', 'Backend'),
('Java', 'Backend'),
('Spring Boot', 'Backend'),
('Node.js', 'Backend'),
('Express', 'Backend'),
('Go', 'Backend'),
('MySQL', 'Database'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('AWS', 'DevOps'),
('CI/CD Pipelines', 'DevOps'),
('Machine Learning', 'AI/ML'),
('Deep Learning', 'AI/ML'),
('PyTorch', 'AI/ML'),
('TensorFlow', 'AI/ML'),
('Computer Vision', 'AI/ML'),
('NLP', 'AI/ML'),
('Figma', 'Design'),
('UI/UX Prototyping', 'Design'),
('Design Systems', 'Design'),
('React Native', 'Mobile'),
('Flutter', 'Mobile'),
('System Design', 'Architecture'),
('Agile & Scrum', 'Management');

-- Insert 15 Diverse College Students
INSERT INTO students (id, roll_no, name, email, department, year, gpa, merit_score, primary_strength, availability_status, available_hours_per_week, bio, github_url, portfolio_url, avatar, past_projects_count, hackathons_won, leadership_badge) VALUES
(1, 'CS2023-01', 'Aarav Sharma', 'aarav.sharma@campus.edu', 'Computer Science & Engineering', 3, 9.40, 94, 'Frontend Wizard (React / Next.js / UI)', 'AVAILABLE', 24, 'Passionate about crafting ultra-responsive web experiences with React, micro-interactions, and high performance.', 'https://github.com/aarav-sharma', 'https://aarav.dev', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 8, 3, TRUE),

(2, 'IT2023-14', 'Ananya Iyer', 'ananya.iyer@campus.edu', 'Information Technology', 4, 9.65, 96, 'Backend Architecture & Distributed Systems', 'AVAILABLE', 20, 'Specializes in scalable microservices, relational and caching data tiers using Python, Django, Spring Boot & MySQL.', 'https://github.com/ananya-iyer', 'https://ananyaiyer.tech', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 10, 4, TRUE),

(3, 'AI2024-05', 'Rohan Verma', 'rohan.verma@campus.edu', 'Artificial Intelligence & Data Science', 3, 9.15, 90, 'Machine Learning & Deep Learning Specialist', 'AVAILABLE', 22, 'Researcher and hacker in LLMs, PyTorch computer vision pipelines, and production inference APIs.', 'https://github.com/rohan-ml', 'https://rohanverma.ai', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 6, 2, FALSE),

(4, 'DS2023-22', 'Priya Nambiar', 'priya.nambiar@campus.edu', 'Computer Science (Design & Media)', 3, 8.85, 88, 'UI/UX & Product Design Specialist', 'AVAILABLE', 18, 'Award-winning Figma UI designer focusing on accessible design tokens, micro-animations, and user-centric flows.', 'https://github.com/priya-ui', 'https://priyanambiar.design', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 7, 2, TRUE),

(5, 'CS2022-89', 'Kavya Deshmukh', 'kavya.d@campus.edu', 'Computer Science & Engineering', 4, 9.30, 92, 'Full-Stack Engineer & Cloud Deployments', 'AVAILABLE', 25, 'End-to-end full stack builder with React, Node/Express, PostgreSQL, Docker, and CI/CD pipelines.', 'https://github.com/kavya-cloud', 'https://kavyadeshmukh.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 11, 3, TRUE),

(6, 'ECE2023-33', 'Vikramaditya Rao', 'vikram.rao@campus.edu', 'Electronics & Communication', 3, 8.40, 82, 'DevOps & Cloud Infrastructure', 'AVAILABLE', 20, 'Enthusiast for Kubernetes clusters, Dockerized container orchestration, Prometheus telemetry, and AWS cloud.', 'https://github.com/vikram-ops', 'https://vikramrao.cloud', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 5, 1, FALSE),

(7, 'CS2024-11', 'Sneha Kulkarni', 'sneha.k@campus.edu', 'Computer Science & Engineering', 2, 8.70, 84, 'Frontend Wizard (React / Next.js / UI)', 'AVAILABLE', 18, 'Frontend enthusiast specializing in React, TypeScript, Tailwind CSS, and interactive state management.', 'https://github.com/sneha-codes', 'https://snehak.dev', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 4, 1, FALSE),

(8, 'IT2023-55', 'Devansh Mehta', 'devansh.m@campus.edu', 'Information Technology', 3, 8.90, 87, 'Backend Architecture & Distributed Systems', 'AVAILABLE', 22, 'Database optimization expert in MySQL, query profiling, Spring Boot, and REST API architectural patterns.', 'https://github.com/devansh-m', 'https://devanshmehta.io', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 7, 2, FALSE),

(9, 'AI2023-09', 'Tanvi Saxena', 'tanvi.saxena@campus.edu', 'Artificial Intelligence & Data Science', 3, 9.25, 91, 'Machine Learning & Deep Learning Specialist', 'LIMITED', 12, 'NLP researcher fine-tuning Transformers, building RAG systems, and integrating FastAPI model endpoints.', 'https://github.com/tanvi-nlp', 'https://tanvisaxena.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 6, 2, FALSE),

(10, 'SE2022-04', 'Arjun Patel', 'arjun.patel@campus.edu', 'Software Engineering', 4, 9.50, 95, 'Full-Stack Engineer & Cloud Deployments', 'AVAILABLE', 26, 'Team captain and full-stack veteran. Built 4 production college enterprise tools using React, Flask, and MySQL.', 'https://github.com/arjun-patel', 'https://arjunpatel.pro', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 12, 5, TRUE),

(11, 'CS2024-44', 'Meera Nair', 'meera.nair@campus.edu', 'Computer Science & Engineering', 2, 8.60, 81, 'UI/UX & Product Design Specialist', 'AVAILABLE', 20, 'Focusing on wireframing, user persona mapping, interactive design prototypes, and frontend HTML/CSS styling.', 'https://github.com/meera-design', 'https://meeranair.design', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 4, 1, FALSE),

(12, 'IT2024-18', 'Karthik Raja', 'karthik.raja@campus.edu', 'Information Technology', 2, 8.10, 78, 'Mobile App Specialist (React Native & Flutter)', 'AVAILABLE', 22, 'Cross-platform mobile developer with React Native, Flutter, Firebase integration, and SQLite local storage.', 'https://github.com/karthik-mobile', 'https://karthik.tech', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 5, 1, FALSE),

(13, 'DS2023-08', 'Ishita Banerji', 'ishita.b@campus.edu', 'Data Science', 3, 9.05, 89, 'Data Analytics & Business Intelligence', 'AVAILABLE', 20, 'Extracts insights from large data sets using Python, Pandas, Tableau, MySQL, and statistical testing.', 'https://github.com/ishita-ds', 'https://ishitabanerji.com', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 6, 2, FALSE),

(14, 'CS2023-77', 'Farhan Qureshi', 'farhan.q@campus.edu', 'Computer Science & Engineering', 3, 7.90, 74, 'Backend Architecture & Distributed Systems', 'BUSY', 8, 'Backend developer working on legacy systems, currently finishing capstone research milestone.', 'https://github.com/farhan-q', 'https://farhan.org', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 3, 0, FALSE),

(15, 'SE2023-19', 'Rhea Singhania', 'rhea.s@campus.edu', 'Software Engineering', 3, 9.35, 93, 'Full-Stack Engineer & Cloud Deployments', 'AVAILABLE', 24, 'Full-stack builder with expertise in React, Java Spring Boot, MySQL, and automated testing with JUnit and Cypress.', 'https://github.com/rhea-singh', 'https://rheasinghania.tech', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 9, 3, TRUE);

-- Insert Student Skills with Proficiencies (1 to 5)
-- Aarav Sharma (Frontend Wizard)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(1, 'React', 5, 2.5),
(1, 'TypeScript', 4, 2.0),
(1, 'Tailwind CSS', 5, 2.5),
(1, 'Next.js', 4, 1.5),
(1, 'Figma', 3, 1.0);

-- Ananya Iyer (Backend Architecture)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(2, 'Python', 5, 3.0),
(2, 'Flask', 4, 2.5),
(2, 'Django', 5, 2.5),
(2, 'MySQL', 5, 3.0),
(2, 'Spring Boot', 4, 2.0),
(2, 'Docker', 3, 1.5);

-- Rohan Verma (ML Specialist)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(3, 'Python', 5, 3.0),
(3, 'Machine Learning', 5, 2.5),
(3, 'PyTorch', 5, 2.0),
(3, 'FastAPI', 4, 1.5),
(3, 'TensorFlow', 4, 2.0);

-- Priya Nambiar (UI/UX)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(4, 'Figma', 5, 3.0),
(4, 'UI/UX Prototyping', 5, 2.5),
(4, 'Design Systems', 5, 2.0),
(4, 'React', 3, 1.5),
(4, 'Tailwind CSS', 4, 2.0);

-- Kavya Deshmukh (Full Stack)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(5, 'React', 5, 3.0),
(5, 'Node.js', 5, 3.0),
(5, 'MySQL', 4, 2.5),
(5, 'Docker', 4, 2.0),
(5, 'TypeScript', 4, 2.0);

-- Vikramaditya Rao (DevOps)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(6, 'Docker', 5, 2.5),
(6, 'Kubernetes', 4, 2.0),
(6, 'AWS', 4, 2.0),
(6, 'Python', 3, 1.5),
(6, 'CI/CD Pipelines', 4, 2.0);

-- Sneha Kulkarni (Frontend)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(7, 'React', 4, 1.5),
(7, 'Tailwind CSS', 4, 1.5),
(7, 'TypeScript', 3, 1.0),
(7, 'Figma', 3, 1.0);

-- Devansh Mehta (Backend)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(8, 'Java', 5, 2.5),
(8, 'Spring Boot', 4, 2.0),
(8, 'MySQL', 5, 2.5),
(8, 'Redis', 3, 1.0);

-- Tanvi Saxena (NLP / AI)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(9, 'Python', 5, 2.5),
(9, 'NLP', 5, 2.0),
(9, 'PyTorch', 4, 1.5),
(9, 'FastAPI', 3, 1.0);

-- Arjun Patel (Full Stack Lead)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(10, 'React', 5, 3.5),
(10, 'Python', 5, 3.5),
(10, 'Flask', 5, 3.0),
(10, 'MySQL', 5, 3.5),
(10, 'Docker', 4, 2.0),
(10, 'Agile & Scrum', 5, 2.5);

-- Meera Nair (UI/UX)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(11, 'Figma', 4, 1.5),
(11, 'UI/UX Prototyping', 4, 1.5),
(11, 'Tailwind CSS', 3, 1.0);

-- Karthik Raja (Mobile)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(12, 'React Native', 5, 2.0),
(12, 'Flutter', 4, 1.5),
(12, 'React', 4, 1.5),
(12, 'Firebase', 4, 1.5);

-- Ishita Banerji (Data Science)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(13, 'Python', 5, 2.5),
(13, 'MySQL', 4, 2.0),
(13, 'Machine Learning', 4, 2.0),
(13, 'Data Analytics & Business Intelligence', 5, 2.5);

-- Farhan Qureshi (Backend)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(14, 'Java', 4, 2.0),
(14, 'MySQL', 3, 1.5),
(14, 'Spring Boot', 3, 1.5);

-- Rhea Singhania (Full Stack)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience) VALUES
(15, 'React', 5, 2.5),
(15, 'Java', 4, 2.5),
(15, 'Spring Boot', 4, 2.0),
(15, 'MySQL', 5, 2.5),
(15, 'Agile & Scrum', 4, 2.0);

