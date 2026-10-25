import React from "react";
import { UserCheck, FileText, Cpu, Users, BarChart3, ChevronRight } from "lucide-react";

export default function StepNavigation({ activeStep, setActiveStep, selectedProject, formedTeam }) {
  const steps = [
    {
      num: 1,
      title: "Step 1: Student Profile",
      subtitle: "Skills, Merits & Availability",
      icon: UserCheck
    },
    {
      num: 2,
      title: "Step 2: Project Requirement",
      subtitle: "Roles & Skill Demands",
      icon: FileText
    },
    {
      num: 3,
      title: "Step 3: Skill Match",
      subtitle: "Compatibility Breakdown",
      icon: Cpu
    },
    {
      num: 4,
      title: "Step 4: Team Suggestion",
      subtitle: "Synergy & Assembly",
      icon: Users
    },
    {
      num: 5,
      title: "Step 5: Contribution Report",
      subtitle: "Workload & Sprint Analytics",
      icon: BarChart3
    }
  ];

  return (
    <div className="no-print" style={{
      padding: "24px 32px 12px 32px",
      maxWidth: 1400,
      margin: "0 auto",
      width: "100%"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        background: "rgba(17, 24, 39, 0.6)",
        border: "1px solid var(--border-light)",
        borderRadius: 16,
        padding: 8,
        boxShadow: "var(--shadow-sm)"
      }}>
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          const isDone = activeStep > s.num;

          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                background: isActive
                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.15))"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(99, 102, 241, 0.5)"
                  : "1px solid transparent",
                textAlign: "left",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive
                  ? "var(--primary)"
                  : isDone
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(255, 255, 255, 0.05)",
                color: isActive
                  ? "#fff"
                  : isDone
                  ? "#34d399"
                  : "var(--text-dim)",
                fontWeight: 700,
                fontSize: "0.85rem",
                boxShadow: isActive ? "0 0 15px rgba(99, 102, 241, 0.5)" : "none"
              }}>
                <Icon size={18} />
              </div>

              <div style={{ overflow: "hidden" }}>
                <div style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: isActive ? "#ffffff" : isDone ? "#e2e8f0" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontSize: "0.72rem",
                  color: isActive ? "#a5b4fc" : "var(--text-dim)",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}>
                  {s.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

