import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  LogOut,
  RefreshCw,
  Mail,
  UserCheck,
  ShieldCheck,
  Zap,
  ChevronRight
} from "lucide-react";
import { loginWithGmail, updateAvailabilityViaGmail } from "../api";

export default function StudentLoginModal({
  isOpen,
  onClose,
  loggedInStudent,
  setLoggedInStudent,
  onAvailabilityUpdated
}) {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [availableHours, setAvailableHours] = useState(20);
  const [availabilityStatus, setAvailabilityStatus] = useState("AVAILABLE");
  const [calendarSyncing, setCalendarSyncing] = useState(false);

  // Suggested Demo Campus Gmails for quick 1-click test
  const demoGmails = [
    { name: "Aarav Sharma", email: "aarav.sharma@campus.edu", role: "Frontend Wizard" },
    { name: "Ananya Iyer", email: "ananya.iyer@campus.edu", role: "Backend Architect" },
    { name: "Rohan Verma", email: "rohan.verma@campus.edu", role: "AI & ML Specialist" },
    { name: "Priya Nambiar", email: "priya.nambiar@campus.edu", role: "UI/UX Designer" },
    { name: "Kavya Deshmukh", email: "kavya.d@campus.edu", role: "Full-Stack Engineer" }
  ];

  useEffect(() => {
    if (loggedInStudent) {
      setAvailableHours(loggedInStudent.available_hours_per_week || 20);
      setAvailabilityStatus(loggedInStudent.availability_status || "AVAILABLE");
    }
  }, [loggedInStudent]);

  if (!isOpen) return null;

  const handleGmailLogin = async (targetEmail) => {
    const emailToUse = (targetEmail || emailInput).trim();
    if (!emailToUse) {
      setErrorMsg("Please enter your campus Gmail address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Login or auto-create student if new
      const res = await loginWithGmail(emailToUse, true);
      setLoggedInStudent(res.student);
      setAvailableHours(res.student.available_hours_per_week || 20);
      setAvailabilityStatus(res.student.availability_status || "AVAILABLE");
      localStorage.setItem("campus_student_session", JSON.stringify(res.student));
      setSuccessMsg(`Welcome, ${res.student.name}! Authenticated via Gmail.`);
    } catch (err) {
      setErrorMsg(err.message || "Failed to authenticate via Gmail.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async () => {
    if (!loggedInStudent) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await updateAvailabilityViaGmail({
        email: loggedInStudent.email,
        student_id: loggedInStudent.id,
        availability_status: availabilityStatus,
        available_hours_per_week: availableHours
      });

      setLoggedInStudent(res.student);
      localStorage.setItem("campus_student_session", JSON.stringify(res.student));
      setSuccessMsg(`Availability updated to ${availabilityStatus} (${availableHours} hrs/wk) via Gmail!`);
      if (onAvailabilityUpdated) {
        onAvailabilityUpdated(res.student);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to update availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCalendarSync = () => {
    setCalendarSyncing(true);
    setSuccessMsg("");
    setTimeout(() => {
      // Simulating Google Calendar API inspection of student schedule
      const simulatedFreeHours = 24;
      setAvailableHours(simulatedFreeHours);
      setAvailabilityStatus("AVAILABLE");
      setCalendarSyncing(false);
      setSuccessMsg("Google Calendar Synced: Analyzed 5 lectures & 2 labs -> Calculated 24 free project hours!");
    }, 1000);
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    localStorage.removeItem("campus_student_session");
    setEmailInput("");
    setSuccessMsg("Logged out successfully.");
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.78)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 120,
      padding: 20
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 20,
        maxWidth: 620,
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        padding: 32,
        position: "relative",
        boxShadow: "var(--shadow-md)"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)"
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          {/* Google 'G' icon emblem */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>
              Student Gmail Portal
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Sign in with your campus Gmail to set and synchronize your project availability
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div style={{
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fda4af",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: "0.85rem",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#6ee7b7",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: "0.85rem",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        {/* VIEW 1: NOT LOGGED IN - GMAIL SIGN-IN FORM */}
        {!loggedInStudent ? (
          <div>
            <div style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-light)",
              borderRadius: 14,
              padding: 20,
              marginBottom: 20
            }}>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                Enter Your Campus Gmail Address
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                  <input
                    type="email"
                    placeholder="e.g. aarav.sharma@campus.edu or name@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ width: "100%", paddingLeft: 38 }}
                  />
                </div>
                <button
                  onClick={() => handleGmailLogin()}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #4285F4, #34A853)",
                    color: "#fff",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(66, 133, 244, 0.3)"
                  }}
                >
                  {loading ? "Authenticating..." : "Sign in with Gmail"}
                </button>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>
                Or 1-Click Sign-in with Campus Student Gmail:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {demoGmails.map((dm) => (
                  <button
                    key={dm.email}
                    onClick={() => handleGmailLogin(dm.email)}
                    style={{
                      background: "var(--bg-card-alt)",
                      border: "1px solid var(--border-light)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(66, 133, 244, 0.2)",
                        color: "#60a5fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: 700
                      }}>
                        {dm.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>{dm.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{dm.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600 }}>
                        {dm.role}
                      </span>
                      <ChevronRight size={14} color="var(--text-dim)" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: AUTHENTICATED STUDENT - MANAGE AVAILABILITY THROUGH GMAIL */
          <div>
            {/* Authenticated Student Banner */}
            <div style={{
              background: "linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(52, 168, 83, 0.1))",
              border: "1px solid rgba(66, 133, 244, 0.3)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <img
                  src={loggedInStudent.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={loggedInStudent.name}
                  style={{ width: 50, height: 50, borderRadius: 12, objectFit: "cover" }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>
                      {loggedInStudent.name}
                    </h4>
                    <span style={{
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#34d399",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 9999,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      <ShieldCheck size={12} /> Verified via Gmail
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {loggedInStudent.email} · {loggedInStudent.roll_no}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "var(--text-muted)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <LogOut size={13} /> Log Out
              </button>
            </div>

            {/* Availability Status Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
                Select Your Campus Project Availability:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {/* AVAILABLE */}
                <button
                  type="button"
                  onClick={() => setAvailabilityStatus("AVAILABLE")}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 10,
                    background: availabilityStatus === "AVAILABLE" ? "rgba(16, 185, 129, 0.2)" : "var(--bg-input)",
                    border: availabilityStatus === "AVAILABLE" ? "2px solid #10b981" : "1px solid var(--border-light)",
                    color: availabilityStatus === "AVAILABLE" ? "#34d399" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🟢 AVAILABLE
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 500 }}>
                    Ready for full sprint
                  </div>
                </button>

                {/* LIMITED */}
                <button
                  type="button"
                  onClick={() => setAvailabilityStatus("LIMITED")}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 10,
                    background: availabilityStatus === "LIMITED" ? "rgba(245, 158, 11, 0.2)" : "var(--bg-input)",
                    border: availabilityStatus === "LIMITED" ? "2px solid #f59e0b" : "1px solid var(--border-light)",
                    color: availabilityStatus === "LIMITED" ? "#fbbf24" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🟡 LIMITED
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 500 }}>
                    Exams / Part-time
                  </div>
                </button>

                {/* BUSY */}
                <button
                  type="button"
                  onClick={() => setAvailabilityStatus("BUSY")}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 10,
                    background: availabilityStatus === "BUSY" ? "rgba(244, 63, 94, 0.2)" : "var(--bg-input)",
                    border: availabilityStatus === "BUSY" ? "2px solid #f43f5e" : "1px solid var(--border-light)",
                    color: availabilityStatus === "BUSY" ? "#fb7185" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  🔴 BUSY
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 2, fontWeight: 500 }}>
                    On other projects
                  </div>
                </button>
              </div>
            </div>

            {/* Weekly Hours Slider & Chips */}
            <div style={{
              background: "var(--bg-input)",
              borderRadius: 14,
              padding: 18,
              marginBottom: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                  Available Hours Per Week:
                </span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#38bdf8" }}>
                  {availableHours} hrs/week
                </span>
              </div>

              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
              />

              {/* Quick Hours Presets */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {[10, 15, 20, 25, 30].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setAvailableHours(h)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      background: availableHours === h ? "var(--primary)" : "rgba(255, 255, 255, 0.05)",
                      color: availableHours === h ? "#fff" : "var(--text-muted)",
                      borderRadius: 8,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Google Calendar Sync Button */}
            <div style={{ marginBottom: 20 }}>
              <button
                type="button"
                onClick={handleGoogleCalendarSync}
                disabled={calendarSyncing}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(66, 133, 244, 0.12)",
                  border: "1px dashed rgba(66, 133, 244, 0.4)",
                  borderRadius: 10,
                  color: "#93c5fd",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer"
                }}
              >
                <Calendar size={16} color="#60a5fa" />
                {calendarSyncing ? "Analyzing Google Calendar Slots..." : "Auto-Detect Bandwidth from Google Calendar"}
              </button>
            </div>

            {/* Main Action Button: Set Availability Through Gmail */}
            <button
              onClick={handleUpdateAvailability}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: "linear-gradient(135deg, #4285F4, #34A853)",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 800,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 4px 20px rgba(66, 133, 244, 0.4)",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              <Zap size={18} />
              {loading ? "Saving via Gmail..." : "Update Availability Through Gmail"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

