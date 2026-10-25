import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Printer,
  Plus,
  Award,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  Download,
  Users,
  ChevronRight,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { fetchTeams, fetchTeamReport, addContribution } from "../api";

export default function Step5ContributionReport({ formedTeam }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(formedTeam?.id || null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  // New Contribution Task Form
  const [taskName, setTaskName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [category, setCategory] = useState("Development");
  const [hoursLogged, setHoursLogged] = useState(4.0);
  const [impactRating, setImpactRating] = useState(5);

  const loadTeamsList = async () => {
    try {
      const data = await fetchTeams();
      setTeams(data);
      if (data.length > 0 && !selectedTeamId) {
        setSelectedTeamId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadReport = async (teamId) => {
    if (!teamId) return;
    setLoading(true);
    try {
      const data = await fetchTeamReport(teamId);
      setReportData(data);
      if (data.member_stats && data.member_stats.length > 0 && !studentId) {
        setStudentId(data.member_stats[0].student_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamsList();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      loadReport(selectedTeamId);
    }
  }, [selectedTeamId]);

  const handleLogTask = async (e) => {
    e.preventDefault();
    try {
      await addContribution(selectedTeamId, {
        student_id: parseInt(studentId, 10),
        task_name: taskName,
        category,
        hours_logged: parseFloat(hoursLogged),
        impact_rating: parseInt(impactRating, 10),
        status: "COMPLETED",
      });
      setShowLogModal(false);
      setTaskName("");
      loadReport(selectedTeamId);
    } catch (err) {
      alert("Error logging contribution: " + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 32px 64px 32px" }}>
      {/* Header */}
      <div className="no-print" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Team Contribution & Analytics Report</h2>
            <span style={{
              background: "rgba(6, 182, 212, 0.15)",
              color: "#38bdf8",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(6, 182, 212, 0.3)"
            }}>
              Step 5 of 5
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
            Monitor team workload equity, competency allocation, milestone velocity, and generate formal audit reports.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {teams.length > 1 && (
            <select
              value={selectedTeamId || ""}
              onChange={(e) => setSelectedTeamId(parseInt(e.target.value, 10))}
              style={{ background: "var(--bg-card)", minWidth: 200 }}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowLogModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "var(--primary)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)"
            }}
          >
            <Plus size={16} /> Log Contribution Task
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "var(--bg-card-alt)",
              color: "#e2e8f0",
              border: "1px solid var(--border-light)",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "0.9rem"
            }}
          >
            <Printer size={16} /> Export / Print Report
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
          Loading contribution analytics...
        </div>
      ) : !reportData ? (
        <div style={{
          textAlign: "center",
          padding: "64px 0",
          background: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-light)"
        }}>
          <p style={{ color: "var(--text-muted)" }}>No formed team found. Please form a team in Step 4 first.</p>
        </div>
      ) : (
        <div className="printable-area">
          {/* Printable Report Header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.85))",
            border: "1px solid rgba(99, 102, 241, 0.25)",
            borderRadius: 20,
            padding: 30,
            marginBottom: 24
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase" }}>
                  Official Campus Capstone Team Formation Audit
                </div>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginTop: 4 }}>
                  {reportData.team_name}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
                  Project: <strong style={{ color: "#e2e8f0" }}>{reportData.project_title}</strong> · Status: <span style={{ color: "#34d399", fontWeight: 700 }}>{reportData.status}</span>
                </p>
              </div>

              {/* KPI Badges */}
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  padding: "12px 18px",
                  borderRadius: 12,
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Team Synergy
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#a5b4fc" }}>
                    {reportData.synergy_score}%
                  </div>
                </div>

                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  padding: "12px 18px",
                  borderRadius: 12,
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Skill Coverage
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8" }}>
                    {reportData.skill_coverage_pct}%
                  </div>
                </div>

                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  padding: "12px 18px",
                  borderRadius: 12,
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Hours Logged
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#34d399" }}>
                    {reportData.total_team_hours}h
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Workload & Equity Breakdown */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 24
          }}>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              Student Workload Distribution & Role Accountability
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {(reportData.member_stats || []).map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-input)",
                    borderRadius: 14,
                    padding: 18,
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <h5 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>
                        {m.name}
                      </h5>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {m.roll_no}
                      </span>
                    </div>
                    <span style={{
                      background: "rgba(99, 102, 241, 0.2)",
                      color: "#c7d2fe",
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: "0.72rem",
                      fontWeight: 700
                    }}>
                      {m.role}
                    </span>
                  </div>

                  {/* Workload percentage bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}>
                      <span style={{ color: "var(--text-muted)" }}>Team Workload Share</span>
                      <span style={{ color: "#38bdf8", fontWeight: 700 }}>{m.workload_share_pct}%</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 9999, overflow: "hidden" }}>
                      <div style={{ width: `${m.workload_share_pct}%`, height: "100%", background: "#06b6d4", borderRadius: 9999 }} />
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    <span>Hours: <strong style={{ color: "#fff" }}>{m.total_hours}h</strong></span>
                    <span>Tasks: <strong style={{ color: "#fff" }}>{m.tasks_count}</strong></span>
                    <span>Impact: <strong style={{ color: "#fbbf24" }}>{m.avg_impact_rating}★</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Hours & Domain Balance */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 24
          }}>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              Engineering Effort by Category
            </h4>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {Object.entries(reportData.category_hours || {}).map(([cat, hrs], idx) => {
                const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];
                const color = colors[idx % colors.length];

                return (
                  <div
                    key={cat}
                    style={{
                      background: "var(--bg-input)",
                      border: `1px solid ${color}44`,
                      borderRadius: 12,
                      padding: "14px 20px",
                      flex: "1 1 180px"
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                      {cat}
                    </div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: color, marginTop: 4 }}>
                      {hrs} hrs
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Contributions Log Table */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: 20,
            padding: 24
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>
                Sprint Contribution Log & Completed Tasks
              </h4>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {reportData.recent_contributions?.length || 0} Total Logged Actions
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "10px 14px" }}>Student</th>
                    <th style={{ padding: "10px 14px" }}>Task / Milestone</th>
                    <th style={{ padding: "10px 14px" }}>Category</th>
                    <th style={{ padding: "10px 14px" }}>Hours</th>
                    <th style={{ padding: "10px 14px" }}>Impact</th>
                    <th style={{ padding: "10px 14px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportData.recent_contributions || []).map((c) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}
                    >
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#fff" }}>
                        {c.student_name}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#cbd5e1" }}>
                        {c.task_name}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          fontSize: "0.75rem",
                          background: "rgba(99, 102, 241, 0.15)",
                          color: "#c7d2fe",
                          padding: "2px 8px",
                          borderRadius: 6
                        }}>
                          {c.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#38bdf8" }}>
                        {c.hours_logged}h
                      </td>
                      <td style={{ padding: "12px 14px", color: "#fbbf24" }}>
                        {"★".repeat(c.impact_rating)}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.75rem",
                          color: "#34d399",
                          fontWeight: 600
                        }}>
                          <CheckCircle2 size={12} /> {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Contribution Task Modal */}
      {showLogModal && (
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
            maxWidth: 540,
            width: "100%",
            padding: 28
          }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 4 }}>
              Log Sprint Task Contribution
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
              Record individual progress, hours invested, and faculty impact rating.
            </p>

            <form onSubmit={handleLogTask}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                  Team Member
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  style={{ width: "100%" }}
                  required
                >
                  {(reportData?.member_stats || []).map((m) => (
                    <option key={m.student_id} value={m.student_id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                  Task / Feature Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implemented JWT Authentication & Role Guards"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value="Development">Development</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="Research">Research & ML</option>
                    <option value="Testing">Testing & QA</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Hours Dedicated
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="50"
                    value={hoursLogged}
                    onChange={(e) => setHoursLogged(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>
                  Impact Rating (1 to 5 Stars)
                </label>
                <select
                  value={impactRating}
                  onChange={(e) => setImpactRating(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value={5}>5 Stars - High Innovation / Critical Path</option>
                  <option value={4}>4 Stars - Major Feature Delivery</option>
                  <option value={3}>3 Stars - Standard Milestone</option>
                  <option value={2}>2 Stars - Minor Patch</option>
                  <option value={1}>1 Star - Routine Cleanup</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
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
                    fontWeight: 700
                  }}
                >
                  Save Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

