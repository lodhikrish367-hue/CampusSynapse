import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StepNavigation from "./components/StepNavigation";
import Step1Students from "./components/Step1Students";
import Step2ProjectRequirement from "./components/Step2ProjectRequirement";
import Step3SkillMatch from "./components/Step3SkillMatch";
import Step4TeamSuggestion from "./components/Step4TeamSuggestion";
import Step5ContributionReport from "./components/Step5ContributionReport";
import StudentLoginModal from "./components/StudentLoginModal";
import { fetchHealth, fetchProjects, fetchTeams } from "./api";

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [systemHealth, setSystemHealth] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formedTeam, setFormedTeam] = useState(null);
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Load saved student session from localStorage if any
  const [loggedInStudent, setLoggedInStudent] = useState(() => {
    try {
      const saved = localStorage.getItem("campus_student_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load initial health and projects
  useEffect(() => {
    const initData = async () => {
      try {
        const [health, projs, teams] = await Promise.all([
          fetchHealth().catch(() => null),
          fetchProjects().catch(() => []),
          fetchTeams().catch(() => [])
        ]);
        if (health) setSystemHealth(health);
        if (projs && projs.length > 0) setSelectedProject(projs[0]);
        if (teams && teams.length > 0) setFormedTeam(teams[0]);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    initData();
  }, []);

  const handleAvailabilityUpdated = (updatedStudent) => {
    setLoggedInStudent(updatedStudent);
    setReloadTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Professional Top Navigation */}
      <Navbar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        systemHealth={systemHealth}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        loggedInStudent={loggedInStudent}
      />

      {/* 5-Step Process Bar */}
      <StepNavigation
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        selectedProject={selectedProject}
        formedTeam={formedTeam}
      />

      {/* Main Multi-Step Workspace */}
      <main style={{ flex: 1 }}>
        {activeStep === 1 && (
          <Step1Students
            onProceedToStep2={() => setActiveStep(2)}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
            loggedInStudent={loggedInStudent}
            reloadTrigger={reloadTrigger}
          />
        )}

        {activeStep === 2 && (
          <Step2ProjectRequirement
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onProceedToStep3={(project) => {
              setSelectedProject(project);
              setActiveStep(3);
            }}
          />
        )}

        {activeStep === 3 && (
          <Step3SkillMatch
            selectedProject={selectedProject}
            onProceedToStep4={() => setActiveStep(4)}
          />
        )}

        {activeStep === 4 && (
          <Step4TeamSuggestion
            selectedProject={selectedProject}
            formedTeam={formedTeam}
            setFormedTeam={setFormedTeam}
            onProceedToStep5={(team) => {
              setFormedTeam(team);
              setActiveStep(5);
            }}
          />
        )}

        {activeStep === 5 && (
          <Step5ContributionReport
            formedTeam={formedTeam}
          />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="no-print" style={{
        borderTop: "1px solid var(--border-light)",
        background: "rgba(11, 15, 25, 0.9)",
        padding: "24px 32px",
        marginTop: "auto"
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
              CampusSynapse Enterprise Engine
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginTop: 2 }}>
              Built with React, Python Flask, and MySQL. Powered by Multi-Objective Team Synergy Optimization.
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: "0.82rem" }}>
            <button
              onClick={() => setActiveStep(1)}
              style={{ background: "none", color: "var(--text-muted)" }}
            >
              1. Student Profiles
            </button>
            <span style={{ color: "var(--border-light)" }}>•</span>
            <button
              onClick={() => setActiveStep(2)}
              style={{ background: "none", color: "var(--text-muted)" }}
            >
              2. Requirements
            </button>
            <span style={{ color: "var(--border-light)" }}>•</span>
            <button
              onClick={() => setActiveStep(3)}
              style={{ background: "none", color: "var(--text-muted)" }}
            >
              3. Skill Match
            </button>
            <span style={{ color: "var(--border-light)" }}>•</span>
            <button
              onClick={() => setActiveStep(4)}
              style={{ background: "none", color: "var(--text-muted)" }}
            >
              4. Team Formation
            </button>
            <span style={{ color: "var(--border-light)" }}>•</span>
            <button
              onClick={() => setActiveStep(5)}
              style={{ background: "none", color: "var(--text-muted)" }}
            >
              5. Contribution Report
            </button>
          </div>
        </div>
      </footer>

      {/* Student Gmail Login & Availability Portal Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        loggedInStudent={loggedInStudent}
        setLoggedInStudent={setLoggedInStudent}
        onAvailabilityUpdated={handleAvailabilityUpdated}
      />
    </div>
  );
}
