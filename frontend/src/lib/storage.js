const KEY = "study-assistant:sessions";
const MAX_SESSIONS = 12;

export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSession({ notes, mode, count, studySet }) {
  try {
    const sessions = loadSessions();
    const entry = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      notes,
      mode,
      count,
      studySet,
    };
    const next = [entry, ...sessions].slice(0, MAX_SESSIONS);
    localStorage.setItem(KEY, JSON.stringify(next));
    return entry;
  } catch {
    // Storage can fail (quota, private browsing, etc). Saving history is a
    // nice-to-have, not something that should ever break the app.
    return null;
  }
}

export function deleteSession(id) {
  try {
    const sessions = loadSessions().filter((s) => s.id !== id);
    localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {
    /* ignore */
  }
}

export function loadTheme() {
  try {
    return localStorage.getItem("study-assistant:theme") || null;
  } catch {
    return null;
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem("study-assistant:theme", theme);
  } catch {
    /* ignore */
  }
}
