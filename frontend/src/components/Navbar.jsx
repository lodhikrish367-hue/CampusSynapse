import React from "react";
import { Users, Award, ShieldCheck, Sparkles, Database, Layers } from "lucide-react";

export default function Navbar({ activeStep, setActiveStep, systemHealth, onOpenStudentLogin, loggedInStudent }) {
  const dbType = systemHealth?.database_type || "MySQL";
  const isMysql = dbType.includes("MySQL") && !dbType.includes("Fallback");

  return (
    <header style={{
      borderBottom: "1px solid var(--border-light)",
      background: "rgba(11, 15, 25, 0.8)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "16px 32px"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1400,
        margin: "0 auto"
      }}>
        {/* Logo and Tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>
                Campus<span style={{ color: "#06b6d4" }}>Synapse</span>
              </span>
              <span style={{
                background: "rgba(99, 102, 241, 0.2)",
                color: "#a5b4fc",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 9999,
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}>
                v2.5 PRO
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Intelligent Campus Project Team Formation & Contribution System
            </p>
          </div>
        </div>

        {/* Database & Campus Status Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            background: isMysql ? "rgba(16, 185, 129, 0.12)" : "rgba(6, 182, 212, 0.12)",
            border: `1px solid ${isMysql ? "rgba(16, 185, 129, 0.3)" : "rgba(6, 182, 212, 0.3)"}`,
            borderRadius: 9999,
            fontSize: "0.8rem"
          }}>
            <Database size={14} color={isMysql ? "#10b981" : "#06b6d4"} />
            <span style={{ color: "var(--text-muted)" }}>Database:</span>
            <span style={{ fontWeight: 600, color: isMysql ? "#34d399" : "#38bdf8" }}>
              {dbType}
            </span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            padding: "6px 14px",
            borderRadius: 9999,
            fontSize: "0.8rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={14} color="#a5b4fc" />
              <span style={{ color: "var(--text-muted)" }}>Students:</span>
              <span style={{ fontWeight: 700, color: "#fff" }}>
                {systemHealth?.metrics?.total_students || 15}
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: "var(--border-light)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={14} color="#34d399" />
              <span style={{ color: "var(--text-muted)" }}>Formed Teams:</span>
              <span style={{ fontWeight: 700, color: "#34d399" }}>
                {systemHealth?.metrics?.total_teams_formed || 0}
              </span>
            </div>
          </div>
          {/* Student Gmail Login / My Availability Button */}
          <button
            onClick={onOpenStudentLogin}
            title="Set availability via Gmail"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              background: loggedInStudent
                ? "linear-gradient(135deg, rgba(66, 133, 244, 0.2), rgba(52, 168, 83, 0.2))"
                : "linear-gradient(135deg, #4285F4, #34A853)",
              border: loggedInStudent ? "1px solid rgba(66, 133, 244, 0.4)" : "none",
              borderRadius: 9999,
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: loggedInStudent ? "none" : "0 2px 10px rgba(66, 133, 244, 0.35)",
              transition: "transform 0.15s ease"
            }}
          >
            {/* Google G icon */}
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {loggedInStudent ? (
              <span>{loggedInStudent.name.split(" ")[0]} ({loggedInStudent.available_hours_per_week}h/wk · {loggedInStudent.availability_status})</span>
            ) : (
              <span>Student Login (Gmail)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

