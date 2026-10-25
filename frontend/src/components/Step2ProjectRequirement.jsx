import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FolderGit2,
  Compass,
  Star
} from "lucide-react";
import { fetchProjects, createProject } from "../api";

export default function Step2ProjectRequirement({
  selectedProject,
  setSelectedProject,
  onProceedToStep3,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("select"); // "select" or "create"

  // New Project Form State
  const [title, setTitle] = useState("AI-Powered Campus Library & Knowledge Graph");
  const [domain, setDomain] = useState("AI / Knowledge Systems & Web");
  const [description, setDescription] = useState(
    "A unified digital research assistant for university students with vector embeddings, semantic paper search, and automated citation mapping."
  );
  const [teamSize, setTeamSize] = useState(4);
  const [minGpa, setMinGpa] = useState(7.5);
  const [minHours, setMinHours] = useState(15);
  const [durationWeeks, setDurationWeeks] = useState(8);

  const [roles, setRoles] = useState([
    {
      role_name: "Frontend Lead",
      is_lead: true,
      required_skills: [
        { skill: "React", min_level: 4, weight: 5 },
        { skill: "Tailwind CSS", min_level: 3, weight: 3 },
      ],
    },
    {
      role_name: "Backend Architect",
      is_lead: false,
      required_skills: [
        { skill: "Python", min_level: 4, weight: 5 },
        { skill: "MySQL", min_level: 4, weight: 4 },
        { skill: "Flask", min_level: 3, weight: 3 },
      ],
    },
    {
      role_name: "AI/ML Engineer",
      is_lead: false,
      required_skills: [
        { skill: "Machine Learning", min_level: 4, weight: 5 },
        { skill: "PyTorch", min_level: 3, weight: 4 },
        { skill: "Python", min_level: 4, weight: 4 },
      ],
    },
    {
      role_name: "UI/UX & Product Designer",
      is_lead: false,
      required_skills: [
        { skill: "Figma", min_level: 4, weight: 5 },
        { skill: "UI/UX Prototyping", min_level: 4, weight: 4 },
      ],
    },
  ]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleApplyPreset = (presetName) => {
    if (presetName === "saas") {
      setTitle("NextGen Student Collaboration SaaS Platform");
      setDomain("Full-Stack Web SaaS & Cloud");
      setDescription("A multi-tenant cloud workspace for student capstone teams with real-time markdown docs, task Kanban, and chat.");
      setRoles([
        {
          role_name: "Frontend Lead",
          is_lead: true,
          required_skills: [
            { skill: "React", min_level: 4, weight: 5 },
            { skill: "TypeScript", min_level: 4, weight: 4 },
          ],
        },
        {
          role_name: "Backend Engineer",
          is_lead: false,
          required_skills: [
            { skill: "Python", min_level: 4, weight: 5 },
            { skill: "MySQL", min_level: 4, weight: 4 },
          ],
        },
        {
          role_name: "DevOps & Cloud Engineer",
          is_lead: false,
          required_skills: [
            { skill: "Docker", min_level: 4, weight: 5 },
            { skill: "Kubernetes", min_level: 3, weight: 4 },
          ],
        },
        {
          role_name: "UI/UX Designer",
          is_lead: false,
          required_skills: [
            { skill: "Figma", min_level: 4, weight: 5 },
            { skill: "Design Systems", min_level: 3, weight: 3 },
          ],
        },
      ]);
    } else if (presetName === "ai") {
      setTitle("Campus Smart Health & Mental Wellness AI");
      setDomain("AI / Healthcare Platform");
      setDescription("Predictive diagnostic companion helping students track daily sleep patterns, academic stress biomarkers, and lifestyle recommendations.");
      setRoles([
        {
          role_name: "AI/ML Lead",
          is_lead: true,
          required_skills: [
            { skill: "Machine Learning", min_level: 4, weight: 5 },
            { skill: "PyTorch", min_level: 4, weight: 4 },
            { skill: "Python", min_level: 5, weight: 5 },
          ],
        },
        {
          role_name: "Backend & Data Architect",
          is_lead: false,
          required_skills: [
            { skill: "Python", min_level: 4, weight: 5 },
            { skill: "MySQL", min_level: 4, weight: 4 },
            { skill: "FastAPI", min_level: 3, weight: 3 },
          ],
        },
        {
          role_name: "Frontend Experience Engineer",
          is_lead: false,
          required_skills: [
            { skill: "React", min_level: 4, weight: 5 },
            { skill: "Tailwind CSS", min_level: 3, weight: 4 },
          ],
        },
        {
          role_name: "Product & UI/UX Designer",
          is_lead: false,
          required_skills: [
            { skill: "Figma", min_level: 4, weight: 5 },
            { skill: "UI/UX Prototyping", min_level: 4, weight: 4 },
          ],
        },
      ]);
    }
  };

  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        role_name: "Software Engineer",
        is_lead: false,
        required_skills: [{ skill: "React", min_level: 3, weight: 3 }],
      },
    ]);
  };

  const handleRemoveRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleRoleNameChange = (index, value) => {
    const updated = [...roles];
    updated[index].role_name = value;
    setRoles(updated);
  };

  const handleRoleSkillsChange = (roleIndex, rawText) => {
    const updated = [...roles];
    const parsed = rawText
      .split(",")
      .map((item) => {
        const parts = item.split(":");
        if (parts.length >= 2) {
          return {
            skill: parts[0].trim(),
            min_level: parseInt(parts[1].trim(), 10) || 3,
            weight: 4,
          };
        }
        return { skill: item.trim(), min_level: 3, weight: 3 };
      })
      .filter((s) => s.skill.length > 0);

    updated[roleIndex].required_skills = parsed;
    setRoles(updated);
  };

  const handleSaveAndProceed = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        domain,
        description,
        team_size: roles.length,
        min_gpa: parseFloat(minGpa),
        min_hours_per_week: parseInt(minHours, 10),
        duration_weeks: parseInt(durationWeeks, 10),
        roles,
      };

      const newProj = await createProject(payload);
      setSelectedProject(newProj);
      await loadProjects();
      onProceedToStep3(newProj);
    } catch (err) {
      alert("Error creating project: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px 64px 32px" }}>
      {/* Header */}
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
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Project Requirements & Role Specifications</h2>
            <span style={{
              background: "rgba(6, 182, 212, 0.15)",
              color: "#38bdf8",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(6, 182, 212, 0.3)"
            }}>
              Step 2 of 5
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
            Define project scope, target competencies, minimum GPA benchmarks, and required team roles.
          </p>
        </div>

        {selectedProject && (
          <button
            onClick={() => onProceedToStep3(selectedProject)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)"
            }}
          >
            Run Skill Matching
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Tabs: Choose existing project or define new */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("select")}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.9rem",
            background: activeTab === "select" ? "var(--bg-card-alt)" : "transparent",
            color: activeTab === "select" ? "#fff" : "var(--text-muted)",
            border: activeTab === "select" ? "1px solid var(--primary)" : "1px solid var(--border-light)"
          }}
        >
          Select Existing Project ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.9rem",
            background: activeTab === "create" ? "var(--bg-card-alt)" : "transparent",
            color: activeTab === "create" ? "#fff" : "var(--text-muted)",
            border: activeTab === "create" ? "1px solid var(--primary)" : "1px solid var(--border-light)"
          }}
        >
          + Create New Project Specification
        </button>
      </div>

      {activeTab === "select" ? (
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
            gap: 20
          }}>
            {projects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  style={{
                    background: "var(--bg-card)",
                    border: isSelected ? "2px solid #6366f1" : "1px solid var(--border-light)",
                    borderRadius: 16,
                    padding: 24,
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: isSelected ? "0 0 25px rgba(99, 102, 241, 0.25)" : "none"
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: "absolute",
                      right: 16,
                      top: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: "rgba(99, 102, 241, 0.2)",
                      color: "#818cf8",
                      padding: "4px 10px",
                      borderRadius: 9999,
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={14} /> Active Target
                    </div>
                  )}

                  <div style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--accent-cyan)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 4
                  }}>
                    {proj.domain}
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8, color: "#fff" }}>
                    {proj.title}
                  </h3>

                  <p style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    marginBottom: 16
                  }}>
                    {proj.description}
                  </p>

                  {/* Project Constraints */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    background: "var(--bg-input)",
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 16,
                    textAlign: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Team Size</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{proj.team_size} Members</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Min GPA</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#34d399" }}>{proj.min_gpa.toFixed(1)}+</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Time Commitment</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fbbf24" }}>{proj.min_hours_per_week}h/wk</div>
                    </div>
                  </div>

                  {/* Roles Breakdown */}
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600, marginBottom: 8 }}>
                      Required Roles ({proj.roles?.length || 0}):
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(proj.roles || []).map((r, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(99, 102, 241, 0.12)",
                            border: "1px solid rgba(99, 102, 241, 0.25)",
                            color: "#c7d2fe",
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontWeight: 600
                          }}
                        >
                          {r.role_name} {r.is_lead && "👑"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(proj);
                        onProceedToStep3(proj);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: isSelected ? "var(--primary)" : "var(--bg-card-alt)",
                        color: "#fff",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8
                      }}
                    >
                      {isSelected ? "Match Students for this Project" : "Select & Match Students"}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Create New Project Specification Form */
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 20,
          padding: 32,
          maxWidth: 960,
          margin: "0 auto"
        }}>
          {/* 1-Click Presets */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={20} color="#818cf8" />
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                  Fast-Track Project Templates
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Load pre-configured enterprise specs with calibrated skill demands
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => handleApplyPreset("saas")}
                style={{
                  padding: "8px 14px",
                  background: "rgba(99, 102, 241, 0.2)",
                  color: "#c7d2fe",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  fontWeight: 600
                }}
              >
                SaaS Web Platform
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("ai")}
                style={{
                  padding: "8px 14px",
                  background: "rgba(6, 182, 212, 0.2)",
                  color: "#a5f3fc",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: 8,
                  fontSize: "0.8rem",
                  fontWeight: 600
                }}
              >
                Health AI Diagnostic Companion
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveAndProceed}>
            {/* Title & Domain */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                  Domain / Category
                </label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                Project Overview & Scope
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>

            {/* Quantitative Constraints */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginBottom: 24
            }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                  Minimum Student GPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  value={minGpa}
                  onChange={(e) => setMinGpa(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                  Required Hours / Wk Per Member
                </label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={minHours}
                  onChange={(e) => setMinHours(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                  Project Duration (Weeks)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Role Builder Section */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>
                    Team Roles & Skill Demands ({roles.length} Roles)
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Specify competencies and minimum skill levels (1-5) required for each position.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRole}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "rgba(99, 102, 241, 0.2)",
                    color: "#818cf8",
                    borderRadius: 8,
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  <Plus size={16} /> Add Role
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {roles.map((r, idx) => {
                  const skillsStr = (r.required_skills || [])
                    .map((s) => `${s.skill}: ${s.min_level}`)
                    .join(", ");

                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-light)",
                        borderRadius: 12,
                        padding: 16,
                        display: "grid",
                        gridTemplateColumns: "1.5fr 2.5fr auto",
                        gap: 12,
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: 2 }}>
                          Role {idx + 1} Title
                        </div>
                        <input
                          type="text"
                          value={r.role_name}
                          onChange={(e) => handleRoleNameChange(idx, e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", fontSize: "0.9rem" }}
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: 2 }}>
                          Required Skills & Min Levels (e.g. React: 4, Python: 3)
                        </div>
                        <input
                          type="text"
                          value={skillsStr}
                          onChange={(e) => handleRoleSkillsChange(idx, e.target.value)}
                          placeholder="Skill: Level, Skill: Level"
                          style={{ width: "100%", padding: "8px 10px", fontSize: "0.9rem" }}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(idx)}
                          style={{
                            background: "rgba(244, 63, 94, 0.15)",
                            color: "#fb7185",
                            borderRadius: 8,
                            padding: "8px 10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 14 }}>
              <button
                type="button"
                onClick={() => setActiveTab("select")}
                style={{
                  padding: "12px 20px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "var(--text-muted)",
                  borderRadius: 10,
                  fontWeight: 600
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                  color: "#fff",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)"
                }}
              >
                Save Project & Run Skill Match
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

