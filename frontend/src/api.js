const API_BASE = "http://127.0.0.1:5000/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchStudents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.availability) params.append("availability", filters.availability);
  if (filters.department) params.append("department", filters.department);
  if (filters.min_gpa) params.append("min_gpa", filters.min_gpa);
  if (filters.strength) params.append("strength", filters.strength);

  const res = await fetch(`${API_BASE}/students?${params.toString()}`);
  return res.json();
}

export async function fetchStudent(id) {
  const res = await fetch(`${API_BASE}/students/${id}`);
  return res.json();
}

export async function createStudent(data) {
  const res = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create student");
  }
  return res.json();
}

export async function updateStudent(id, data) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update student");
  }
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  return res.json();
}

export async function fetchProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create project");
  }
  return res.json();
}

export async function fetchCandidateMatches(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/match`);
  return res.json();
}

export async function fetchTeamSuggestions(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/team-suggestions`);
  return res.json();
}

export async function formTeam(data) {
  const res = await fetch(`${API_BASE}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to form team");
  }
  return res.json();
}

export async function fetchTeams() {
  const res = await fetch(`${API_BASE}/teams`);
  return res.json();
}

export async function fetchTeamReport(teamId) {
  const res = await fetch(`${API_BASE}/teams/${teamId}/report`);
  return res.json();
}

export async function addContribution(teamId, data) {
  const res = await fetch(`${API_BASE}/teams/${teamId}/contributions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to log contribution");
  }
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/skills`);
  return res.json();
}

export async function loginWithGmail(email, autoCreate = false) {
  const res = await fetch(`${API_BASE}/students/login-gmail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, auto_create: autoCreate }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to log in with Gmail");
  }
  return data;
}

export async function updateAvailabilityViaGmail(data) {
  const res = await fetch(`${API_BASE}/students/availability-gmail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update availability via Gmail");
  }
  return result;
}

