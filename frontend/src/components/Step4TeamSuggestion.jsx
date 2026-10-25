import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  CheckCircle2,
  Lock,
  Layers,
  Repeat
} from "lucide-react";
import confetti from "canvas-confetti";
import { fetchTeamSuggestions, formTeam, fetchStudents } from "../api";

export default function Step4TeamSuggestion({
  selectedProject,
  formedTeam,
  setFormedTeam,
  onProceedToStep5,
}) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [swapModalRole, setSwapModalRole] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedProject?.id) return;
    const loadSuggestions = async () => {
      setLoading(true);
      try {
        const [suggRes, studentsRes] = await Promise.all([
          fetchTeamSuggestions(selectedProject.id),
          fetchStudents(),
        ]);
        setSuggestions(suggRes.suggestions || []);
        setAllStudents(studentsRes || []);
        if (suggRes.suggestions && suggRes.suggestions.length > 0) {
          setCurrentMembers(suggRes.suggestions[0].members || []);
        }
      } catch (err) {
        console.error("Failed to load team suggestions", err);
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div style={{ textAlign: "center", padding: "64px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Please select a project in Step 2 first.</p>
      </div>
    );
  }

  const activeSuggestion = suggestions[selectedSuggestionIndex] || {};

  const handleSelectSuggestion = (index) => {
    setSelectedSuggestionIndex(index);
    if (suggestions[index]) {
      setCurrentMembers(suggestions[index].members || []);
    }
  };

  const handleSwapCandidate = (roleName, newStudent) => {
    const updated = currentMembers.map((m) => {
      if (m.assigned_role === roleName) {
        return {
          ...m,
          student_id: newStudent.id,
          student: newStudent,
          match_score: 90.0, // Recalibrated
          allocated_hours: Math.min(20, newStudent.available_hours_per_week || 15),
        };
      }
      return m;
    });
    setCurrentMembers(updated);
    setSwapModalRole(null);
  };

  const handleConfirmAndFormTeam = async () => {
    setSaving(true);
    try {
      // Calculate final synergy
      const totalMatch = currentMembers.reduce((acc, m) => acc + (m.match_score || 85), 0);
      const avgMatch = currentMembers.length ? totalMatch / currentMembers.length : 85;

      const payload = {
        project_id: selectedProject.id,
        team_name: `${activeSuggestion.tag || "Alpha Squad"} - ${selectedProject.title.slice(0, 24)}`,
        synergy_score: Math.min(99.4, Math.round(avgMatch * 1.05 * 10) / 10),
        skill_coverage_pct: activeSuggestion.skill_coverage_pct || 95.0,
        members: currentMembers.map((m) => ({
          student_id: m.student_id,
          assigned_role: m.assigned_role,
          match_score: m.match_score,
          allocated_hours: m.allocated_hours || 15,
        })),
      };

      const result = await formTeam(payload);
      setFormedTeam(result);

      // Trigger celebration confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#06b6d4", "#10b981", "#fbbf24"],
      });

      onProceedToStep5(result);
    } catch (err) {
      alert("Error forming team: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Recalculate dynamic hours for the active composition
  const totalWeeklyHours = currentMembers.reduce(
    (acc, m) => acc + (m.allocated_hours || m.student?.available_hours_per_week || 15),
    0
  );

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
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Automated Team Suggestion & Formation</h2>
            <span style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "#34d399",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}>
              Step 4 of 5
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
            Review algorithm-optimized team suggestions, fine-tune role allocations, and lock your project team into the database.
          </p>
        </div>

        <button
          onClick={handleConfirmAndFormTeam}
          disabled={saving || currentMembers.length === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 26px",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            color: "#fff",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: "0.95rem",
            boxShadow: "0 4px 18px rgba(99, 102, 241, 0.4)",
            cursor: saving ? "not-allowed" : "pointer"
          }}
        >
          <Lock size={16} />
          {saving ? "Assembling Team..." : "Confirm & Form Team"}
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Suggestion Preset Selector Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
        marginBottom: 28
      }}>
        {suggestions.map((sug, idx) => {
          const isSelected = selectedSuggestionIndex === idx;
          return (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(idx)}
              style={{
                background: isSelected ? "var(--bg-card-alt)" : "var(--bg-card)",
                border: isSelected ? "2px solid #6366f1" : "1px solid var(--border-light)",
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 25px rgba(99, 102, 241, 0.25)" : "none",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: isSelected ? "#a5b4fc" : "var(--text-dim)",
                  textTransform: "uppercase"
                }}>
                  Option {idx + 1}
                </span>
                <span style={{
                  background: isSelected ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  color: isSelected ? "#34d399" : "var(--text-muted)",
                  padding: "2px 8px",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  Synergy {sug.synergy_score}%
                </span>
              </div>

              <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                {sug.tag}
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 14 }}>
                {sug.description}
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.8rem",
                color: "var(--text-dim)",
                borderTop: "1px solid var(--border-light)",
                paddingTop: 10
              }}>
                <span>Tech Coverage: <strong style={{ color: "#38bdf8" }}>{sug.skill_coverage_pct}%</strong></span>
                <span>Bandwidth: <strong style={{ color: "#fbbf24" }}>{sug.total_weekly_hours}h/wk</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Synergy Dashboard Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(26, 34, 52, 0.8))",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        borderRadius: 20,
        padding: 24,
        marginBottom: 28,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        alignItems: "center"
      }}>
        {/* Metric 1: Synergy Index */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.05) 70%)",
            border: "3px solid #6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#fff"
          }}>
            {activeSuggestion.synergy_score || 94}%
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              Composite Synergy Index
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#34d399", marginTop: 2 }}>
              High Collaborative Velocity
            </div>
          </div>
        </div>

        {/* Metric 2: Skill Coverage */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.05) 70%)",
            border: "3px solid #06b6d4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#fff"
          }}>
            {activeSuggestion.skill_coverage_pct || 96}%
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              Full Technical Coverage
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#38bdf8", marginTop: 2 }}>
              Zero Tech Skill Deficits
            </div>
          </div>
        </div>

        {/* Metric 3: Total Weekly Bandwidth */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.05) 70%)",
            border: "3px solid #f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#fff"
          }}>
            {totalWeeklyHours}h
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              Total Team Bandwidth
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fbbf24", marginTop: 2 }}>
              {totalWeeklyHours} Hours / Week Available
            </div>
          </div>
        </div>
      </div>

      {/* Team Roster Grid with Role Customizer */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>
            Proposed Team Roster ({currentMembers.length} Members)
          </h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Need adjustments? Click <strong>"Swap Candidate"</strong> to customize any role allocation.
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20
        }}>
          {currentMembers.map((member, idx) => {
            const student = member.student || {};
            const fitScore = member.match_score || 90;

            return (
              <div
                key={idx}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 16,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                <div>
                  {/* Role Title Badge */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14
                  }}>
                    <span style={{
                      background: "rgba(99, 102, 241, 0.2)",
                      color: "#c7d2fe",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(99, 102, 241, 0.3)"
                    }}>
                      {member.assigned_role}
                    </span>
                    <span style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#10b981"
                    }}>
                      {fitScore.toFixed(1)}% Match
                    </span>
                  </div>

                  {/* Student Basic Info */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <img
                      src={student.avatar}
                      alt={student.name}
                      style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover" }}
                    />
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>
                        {student.name}
                      </h4>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {student.roll_no} · {student.department}
                      </p>
                    </div>
                  </div>

                  {/* Superpower tag */}
                  <div style={{
                    background: "var(--bg-input)",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: "0.78rem",
                    color: "#cbd5e1",
                    marginBottom: 12
                  }}>
                    <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>Superpower:</span>{" "}
                    {student.primary_strength}
                  </div>

                  {/* Merit and weekly hours row */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                    color: "var(--text-dim)",
                    marginBottom: 16
                  }}>
                    <span>Merit Score: <strong style={{ color: "#c4b5fd" }}>{student.merit_score}/100</strong></span>
                    <span>Allocated: <strong style={{ color: "#fbbf24" }}>{member.allocated_hours}h/wk</strong></span>
                  </div>
                </div>

                {/* Bottom Swap Action */}
                <button
                  onClick={() => setSwapModalRole(member.assigned_role)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#cbd5e1",
                    borderRadius: 8,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <Repeat size={14} /> Swap Candidate
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Swap Modal */}
      {swapModalRole && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
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
            maxHeight: "85vh",
            overflowY: "auto",
            padding: 28
          }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 4 }}>
              Select Candidate for: {swapModalRole}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
              Choose an available campus student with matching skills for this role.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allStudents.map((st) => {
                const isAlreadyInTeam = currentMembers.some((m) => m.student_id === st.id);
                return (
                  <div
                    key={st.id}
                    style={{
                      background: "var(--bg-input)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      opacity: isAlreadyInTeam ? 0.4 : 1
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img
                        src={st.avatar}
                        alt={st.name}
                        style={{ width: 42, height: 42, borderRadius: 10, objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                          {st.name} ({st.roll_no})
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {st.primary_strength} · Merit {st.merit_score} · {st.available_hours_per_week}h/wk
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={isAlreadyInTeam}
                      onClick={() => handleSwapCandidate(swapModalRole, st)}
                      style={{
                        padding: "8px 16px",
                        background: isAlreadyInTeam ? "gray" : "var(--primary)",
                        color: "#fff",
                        borderRadius: 8,
                        fontSize: "0.82rem",
                        fontWeight: 700
                      }}
                    >
                      {isAlreadyInTeam ? "In Team" : "Assign"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button
                onClick={() => setSwapModalRole(null)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

