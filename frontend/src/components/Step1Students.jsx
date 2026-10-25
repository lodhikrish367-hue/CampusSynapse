import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Star,
  Award,
  Clock,
  ExternalLink,
  BookOpen,
  Briefcase,
  Trophy,
  Code2,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle,
  X,
  Edit2
} from "lucide-react";
import { fetchStudents, createStudent, updateStudent } from "../api";

export default function Step1Students({ onProceedToStep2, onOpenStudentLogin, loggedInStudent, reloadTrigger }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    email: "",
    department: "Computer Science & Engineering",
    year: 3,
    gpa: 8.5,
    merit_score: 85,
    primary_strength: "Frontend Wizard (React / Next.js / UI)",
    availability_status: "AVAILABLE",
    available_hours_per_week: 20,
    bio: "",
    github_url: "",
    portfolio_url: "",
    past_projects_count: 5,
    hackathons_won: 2,
    leadership_badge: false,
    skills_text: "React: 5, TypeScript: 4, Tailwind CSS: 4, Node.js: 3"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents({
        search,
        availability: availabilityFilter,
        department: departmentFilter,
      });
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, availabilityFilter, departmentFilter, reloadTrigger]);

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    const skillsString = (student.skills || [])
      .map((s) => `${s.skill_name}: ${s.proficiency_level}`)
      .join(", ");

    setFormData({
      roll_no: student.roll_no,
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year,
      gpa: student.gpa,
      merit_score: student.merit_score,
      primary_strength: student.primary_strength,
      availability_status: student.availability_status,
      available_hours_per_week: student.available_hours_per_week,
      bio: student.bio,
      github_url: student.github_url,
      portfolio_url: student.portfolio_url,
      past_projects_count: student.past_projects_count,
      hackathons_won: student.hackathons_won,
      leadership_badge: student.leadership_badge,
      skills_text: skillsString
    });
    setShowAddModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      // Parse skills from text
      const parsedSkills = formData.skills_text
        .split(",")
        .map((item) => {
          const parts = item.split(":");
          if (parts.length >= 2) {
            return {
              skill_name: parts[0].trim(),
              proficiency_level: parseInt(parts[1].trim(), 10) || 3
            };
          }
          return null;
        })
        .filter(Boolean);

      const payload = {
        ...formData,
        skills: parsedSkills
      };

      if (editingStudent) {
        await updateStudent(editingStudent.id, payload);
      } else {
        await createStudent(payload);
      }

      setShowAddModal(false);
      setEditingStudent(null);
      loadData();
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  // Quick stats
  const availableCount = students.filter(s => s.availability_status === "AVAILABLE").length;
  const avgMerit = students.length ? Math.round(students.reduce((acc, s) => acc + s.merit_score, 0) / students.length) : 0;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px 64px 32px" }}>
      {/* Banner / Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Student Profiles & Talent Roster</h2>
            <span style={{
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              Step 1 of 5
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
            Explore college candidates, their verified technical proficiencies, merits, academic GPAs, and primary superpowers.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => {
              setEditingStudent(null);
              setFormData({
                roll_no: `CS2024-${Math.floor(10 + Math.random() * 89)}`,
                name: "",
                email: "",
                department: "Computer Science & Engineering",
                year: 3,
                gpa: 8.7,
                merit_score: 88,
                primary_strength: "Frontend Wizard (React / Next.js / UI)",
                availability_status: "AVAILABLE",
                available_hours_per_week: 20,
                bio: "",
                github_url: "https://github.com/",
                portfolio_url: "https://",
                past_projects_count: 5,
                hackathons_won: 2,
                leadership_badge: false,
                skills_text: "React: 5, TypeScript: 4, Tailwind CSS: 5, Node.js: 3"
              });
              setShowAddModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "var(--primary)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)"
            }}
          >
            <UserPlus size={16} />
            Add Student Profile
          </button>

          <button
            onClick={onProceedToStep2}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(6, 182, 212, 0.35)"
            }}
          >
            Configure Project
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Student Gmail Login & Availability Callout Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(66, 133, 244, 0.12), rgba(52, 168, 83, 0.08))",
        border: "1px solid rgba(66, 133, 244, 0.3)",
        borderRadius: 16,
        padding: "16px 22px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 14,
        boxShadow: "0 4px 20px rgba(66, 133, 244, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Google G Icon */}
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}>
              {loggedInStudent ? (
                <span>Logged in as: <span style={{ color: "#38bdf8" }}>{loggedInStudent.name}</span> ({loggedInStudent.email})</span>
              ) : (
                <span>Are you a college student? Update your availability via Gmail</span>
              )}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
              {loggedInStudent ? (
                <span>Current Status: <strong style={{ color: "#34d399" }}>{loggedInStudent.availability_status}</strong> ({loggedInStudent.available_hours_per_week} hrs/wk). Click to adjust anytime.</span>
              ) : (
                <span>Sign in with your campus Gmail to set your free hours/week, update availability status, and get matched to upcoming project teams.</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenStudentLogin}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: "linear-gradient(135deg, #4285F4, #34A853)",
            color: "#fff",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.88rem",
            boxShadow: "0 4px 14px rgba(66, 133, 244, 0.35)",
            cursor: "pointer"
          }}
        >
          <Clock size={16} />
          {loggedInStudent ? "Manage Availability via Gmail" : "Set Availability via Gmail"}
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 14,
          padding: 16
        }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
            Total Registered Students
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginTop: 4 }}>
            {students.length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: 2 }}>
            Across 5 Academic Disciplines
          </div>
        </div>

        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 14,
          padding: 16
        }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
            Available for Projects
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#34d399", marginTop: 4 }}>
            {availableCount} <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>/ {students.length}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 2 }}>
            Ready for instant team placement
          </div>
        </div>

        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 14,
          padding: 16
        }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
            Average Merit Rating
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#c084fc", marginTop: 4 }}>
            {avgMerit}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}> / 100</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 2 }}>
            Hackathons, GPA & Project Track Record
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap"
      }}>
        <div style={{
          position: "relative",
          flex: "1 1 280px"
        }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
          <input
            type="text"
            placeholder="Search by student name, roll number, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: 42 }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Filter size={16} color="var(--text-dim)" />
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="">All Availabilities</option>
            <option value="AVAILABLE">Available</option>
            <option value="LIMITED">Limited</option>
            <option value="BUSY">Busy</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ minWidth: 190 }}
          >
            <option value="">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science</option>
            <option value="Information Technology">Information Tech</option>
            <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
            <option value="Software Engineering">Software Eng</option>
            <option value="Electronics & Communication">ECE</option>
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
          Loading student profiles...
        </div>
      ) : students.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "64px 0",
          background: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-light)"
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No students match the current filters.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 20
        }}>
          {students.map((student) => {
            const isAvail = student.availability_status === "AVAILABLE";
            const isLimited = student.availability_status === "LIMITED";

            return (
              <div
                key={student.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 16,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease",
                  position: "relative"
                }}
              >
                {/* Header: Avatar, Name, Department */}
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                    <img
                      src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={student.name}
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        objectFit: "cover",
                        border: "2px solid rgba(255, 255, 255, 0.1)"
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {student.name}
                        </h3>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "rgba(255, 255, 255, 0.06)",
                          color: "#94a3b8"
                        }}>
                          {student.roll_no}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                        {student.department} · Year {student.year}
                      </p>
                    </div>
                  </div>

                  {/* Primary Strength Highlight */}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    borderRadius: 10,
                    padding: "8px 12px",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <Sparkles size={16} color="#818cf8" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e0e7ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Best At: <span style={{ color: "#38bdf8" }}>{student.primary_strength}</span>
                    </div>
                  </div>

                  {/* Merit and Availability Row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className={`badge ${isAvail ? "badge-available" : isLimited ? "badge-limited" : "badge-busy"}`}>
                        <Clock size={12} />
                        {student.available_hours_per_week}h/wk · {student.availability_status}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="badge badge-merit">
                        <Trophy size={12} />
                        Merit {student.merit_score}
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e2e8f0" }}>
                        GPA {student.gpa.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Skill Badges with Proficiency */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {(student.skills || []).slice(0, 4).map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.75rem",
                          background: "var(--bg-card-alt)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          color: "#cbd5e1",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <span>{sk.skill_name}</span>
                        <span style={{ color: "#fbbf24", fontSize: "0.7rem", fontWeight: 700 }}>
                          {sk.proficiency_level}★
                        </span>
                      </span>
                    ))}
                    {(student.skills || []).length > 4 && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", alignSelf: "center" }}>
                        +{student.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: 12,
                  marginTop: 6
                }}>
                  <button
                    onClick={() => handleOpenEdit(student)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "transparent",
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "6px 10px",
                      borderRadius: 6
                    }}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      background: "rgba(99, 102, 241, 0.15)",
                      color: "#a5b4fc",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: "0.82rem",
                      fontWeight: 600
                    }}
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: 20,
            maxWidth: 620,
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: 28,
            position: "relative",
            boxShadow: "var(--shadow-md)"
          }}>
            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 20 }}>
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover" }}
              />
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{selectedStudent.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {selectedStudent.roll_no} · {selectedStudent.department} · Year {selectedStudent.year}
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {selectedStudent.github_url && (
                    <a href={selectedStudent.github_url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                      <Code2 size={14} /> GitHub
                    </a>
                  )}
                  {selectedStudent.portfolio_url && (
                    <a href={selectedStudent.portfolio_url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                      <Globe size={14} /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Superpower banner */}
            <div style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20
            }}>
              <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase" }}>
                Primary Technical Strength
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginTop: 2 }}>
                {selectedStudent.primary_strength}
              </div>
            </div>

            {/* Bio */}
            {selectedStudent.bio && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
                  About & Track Record
                </div>
                <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  {selectedStudent.bio}
                </p>
              </div>
            )}

            {/* Achievements row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 24
            }}>
              <div style={{ background: "var(--bg-input)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>GPA Score</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginTop: 2 }}>
                  {selectedStudent.gpa.toFixed(2)}
                </div>
              </div>

              <div style={{ background: "var(--bg-input)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Hackathons Won</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fbbf24", marginTop: 2 }}>
                  {selectedStudent.hackathons_won} 🏆
                </div>
              </div>

              <div style={{ background: "var(--bg-input)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Past Projects</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#34d399", marginTop: 2 }}>
                  {selectedStudent.past_projects_count}
                </div>
              </div>
            </div>

            {/* Full Skills Breakdown */}
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: 10 }}>
                Verified Skills & Proficiency Levels (1 - 5)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(selectedStudent.skills || []).map((sk, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--bg-card-alt)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      padding: "8px 12px",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>
                      {sk.skill_name}
                    </span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: lvl <= sk.proficiency_level ? "#6366f1" : "rgba(255, 255, 255, 0.15)"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Profile Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: 20,
            maxWidth: 680,
            width: "100%",
            maxHeight: "92vh",
            overflowY: "auto",
            padding: 28,
            position: "relative"
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)"
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6 }}>
              {editingStudent ? "Edit Student Profile" : "Register Campus Student"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
              Specify the student's skills, availability hours, and what role they are best at.
            </p>

            <form onSubmit={handleSaveStudent}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Roll Number / Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roll_no}
                    onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Academic GPA (10.0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="5.0"
                    max="10.0"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Merit Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.merit_score}
                    onChange={(e) => setFormData({ ...formData, merit_score: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Primary Strength (What they are best at) */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                  In What They Are Best At (Primary Strength)
                </label>
                <select
                  value={formData.primary_strength}
                  onChange={(e) => setFormData({ ...formData, primary_strength: e.target.value })}
                  style={{ width: "100%" }}
                >
                  <option value="Frontend Wizard (React / Next.js / UI)">Frontend Wizard (React / Next.js / UI)</option>
                  <option value="Backend Architecture & Distributed Systems">Backend Architecture & Distributed Systems</option>
                  <option value="Machine Learning & Deep Learning Specialist">Machine Learning & Deep Learning Specialist</option>
                  <option value="UI/UX & Product Design Specialist">UI/UX & Product Design Specialist</option>
                  <option value="Full-Stack Engineer & Cloud Deployments">Full-Stack Engineer & Cloud Deployments</option>
                  <option value="DevOps & Cloud Infrastructure">DevOps & Cloud Infrastructure</option>
                  <option value="Mobile App Specialist (React Native & Flutter)">Mobile App Specialist (React Native & Flutter)</option>
                  <option value="Data Analytics & Business Intelligence">Data Analytics & Business Intelligence</option>
                </select>
              </div>

              {/* Availability */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Availability Status
                  </label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="LIMITED">Limited Bandwidth</option>
                    <option value="BUSY">Busy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Available Hours / Week
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={formData.available_hours_per_week}
                    onChange={(e) => setFormData({ ...formData, available_hours_per_week: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Skills formatted list */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                  Skills & Proficiencies (Format: SkillName: Level 1-5, comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills_text}
                  onChange={(e) => setFormData({ ...formData, skills_text: e.target.value })}
                  placeholder="React: 5, Python: 4, MySQL: 4, Docker: 3"
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "10px 18px",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "var(--text-muted)",
                    borderRadius: 8,
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    background: "var(--primary)",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
                  }}
                >
                  {editingStudent ? "Update Profile" : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
