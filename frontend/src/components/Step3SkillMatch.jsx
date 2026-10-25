import React, { useState, useEffect } from "react";
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Sparkles,
  Trophy,
  Clock,
  Layers,
  ChevronDown,
  UserCheck
} from "lucide-react";
import { fetchCandidateMatches } from "../api";

export default function Step3SkillMatch({ selectedProject, onProceedToStep4 }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (!selectedProject?.id) return;
    const loadMatches = async () => {
      setLoading(true);
      try {
        const res = await fetchCandidateMatches(selectedProject.id);
        setMatches(res.candidate_matches || []);
      } catch (err) {
        console.error("Failed to load candidate matches", err);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div style={{ textAlign: "center", padding: "64px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Please select or create a project in Step 2 first.</p>
      </div>
    );
  }

  const projectRoles = selectedProject.roles || [];
  const filteredMatches = matches.filter((m) => {
    if (roleFilter === "ALL") return true;
    return m.best_role === roleFilter;
  });

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
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Skill Matching & Candidate Compatibility</h2>
            <span style={{
              background: "rgba(139, 92, 246, 0.15)",
              color: "#c084fc",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(139, 92, 246, 0.3)"
            }}>
              Step 3 of 5
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
            Evaluating campus talent against <span style={{ color: "#38bdf8", fontWeight: 700 }}>{selectedProject.title}</span> using multidimensional skill vectors and availability weighting.
          </p>
        </div>

        <button
          onClick={onProceedToStep4}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 22px",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            color: "#fff",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.9rem",
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)"
          }}
        >
          Generate Optimal Teams
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 24,
        overflowX: "auto",
        paddingBottom: 4
      }}>
        <button
          onClick={() => setRoleFilter("ALL")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: "0.85rem",
            fontWeight: 700,
            background: roleFilter === "ALL" ? "var(--primary)" : "var(--bg-card)",
            color: roleFilter === "ALL" ? "#fff" : "var(--text-muted)",
            border: "1px solid var(--border-light)",
            whiteSpace: "nowrap"
          }}
        >
          All Candidates ({matches.length})
        </button>

        {projectRoles.map((r, idx) => {
          const count = matches.filter((m) => m.best_role === r.role_name).length;
          const isSelected = roleFilter === r.role_name;
          return (
            <button
              key={idx}
              onClick={() => setRoleFilter(r.role_name)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: "0.85rem",
                fontWeight: 700,
                background: isSelected ? "var(--primary)" : "var(--bg-card)",
                color: isSelected ? "#fff" : "var(--text-muted)",
                border: "1px solid var(--border-light)",
                whiteSpace: "nowrap"
              }}
            >
              {r.role_name} ({count})
            </button>
          );
        })}
      </div>

      {/* Candidate Matches Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
          Calculating vector compatibility and synergy scores...
        </div>
      ) : filteredMatches.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "64px 0",
          background: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-light)"
        }}>
          <p style={{ color: "var(--text-muted)" }}>No candidates found for this role criteria.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: 20
        }}>
          {filteredMatches.map((m) => {
            const student = m.student;
            const score = m.highest_match_score;
            const bestFit = (m.role_breakdown || []).find((r) => r.role_name === m.best_role) || m.role_breakdown[0] || {};
            const isAvail = student.availability_status === "AVAILABLE";

            // Score classification
            const scoreColor = score >= 90 ? "#10b981" : score >= 75 ? "#38bdf8" : "#fbbf24";
            const matchTier = score >= 90 ? "Optimal Match" : score >= 75 ? "Strong Candidate" : "Moderate Fit";

            return (
              <div
                key={student.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 16,
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                <div>
                  {/* Top: Avatar, Name, Match Score Radial Pill */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{ width: 50, height: 50, borderRadius: 12, objectFit: "cover" }}
                      />
                      <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>
                          {student.name}
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {student.roll_no} · {student.department}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      textAlign: "right",
                      background: "var(--bg-card-alt)",
                      border: `1px solid ${scoreColor}44`,
                      borderRadius: 12,
                      padding: "6px 12px"
                    }}>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: scoreColor }}>
                        {score.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: scoreColor, textTransform: "uppercase" }}>
                        {matchTier}
                      </div>
                    </div>
                  </div>

                  {/* Best Suited Role Pill */}
                  <div style={{
                    background: "rgba(99, 102, 241, 0.12)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={14} color="#818cf8" />
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Best Suited For:</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e0e7ff" }}>
                        {m.best_role}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600 }}>
                      GPA {student.gpa.toFixed(2)}
                    </span>
                  </div>

                  {/* Multi-Dimensional Compatibility Progress Bars */}
                  <div style={{
                    background: "var(--bg-input)",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                  }}>
                    {/* Skill Score */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                        <span style={{ color: "var(--text-muted)" }}>Skill Coverage Fit</span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{bestFit.skill_score || 0}%</span>
                      </div>
                      <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ width: `${bestFit.skill_score || 0}%`, height: "100%", background: "#6366f1", borderRadius: 9999 }} />
                      </div>
                    </div>

                    {/* Availability Score */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                        <span style={{ color: "var(--text-muted)" }}>Availability Fit ({student.available_hours_per_week}h/wk)</span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{bestFit.availability_score || 0}%</span>
                      </div>
                      <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ width: `${bestFit.availability_score || 0}%`, height: "100%", background: "#06b6d4", borderRadius: 9999 }} />
                      </div>
                    </div>

                    {/* Merit & Strength Alignment */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                        <span style={{ color: "var(--text-muted)" }}>Merit & Superpower Fit</span>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{bestFit.merit_score || 0}%</span>
                      </div>
                      <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ width: `${bestFit.merit_score || 0}%`, height: "100%", background: "#10b981", borderRadius: 9999 }} />
                      </div>
                    </div>
                  </div>

                  {/* Matched vs Missing Skills */}
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: 600, marginBottom: 6 }}>
                      Competency Analysis:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(bestFit.matched_skills || []).map((ms, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(16, 185, 129, 0.12)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            color: "#6ee7b7",
                            padding: "3px 8px",
                            borderRadius: 6,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <CheckCircle2 size={12} />
                          {ms.skill} (Lvl {ms.student_level})
                        </span>
                      ))}

                      {(bestFit.missing_skills || []).map((ms, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(244, 63, 94, 0.1)",
                            border: "1px solid rgba(244, 63, 94, 0.25)",
                            color: "#fda4af",
                            padding: "3px 8px",
                            borderRadius: 6,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <AlertCircle size={12} />
                          Missing {ms.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer status */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: 12,
                  marginTop: 14
                }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Primary: <span style={{ color: "#fff" }}>{student.primary_strength.split("(")[0]}</span>
                  </span>
                  <span className={`badge ${isAvail ? "badge-available" : "badge-limited"}`}>
                    {student.availability_status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

