import { useState } from "react";

export default function SessionHistory({ sessions, onLoad, onDelete }) {
  const [open, setOpen] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <div className="px-5 sm:px-8 max-w-5xl mx-auto w-full mt-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-faint dark:text-paper-dark/50 hover:text-ink dark:hover:text-paper"
      >
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>&rsaquo;</span>
        Recent sessions ({sessions.length})
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 animate-popIn">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="group relative border border-ink/10 dark:border-night-border rounded-xl p-3.5 bg-paper-panel dark:bg-night-panel hover:border-ink/25 dark:hover:border-paper/25 transition-colors"
            >
              <button type="button" onClick={() => onLoad(s)} className="text-left w-full">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40 mb-1">
                  {s.mode} &middot; {new Date(s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
                <p className="font-display text-sm text-ink dark:text-paper truncate pr-5">{s.studySet.title}</p>
              </button>
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                aria-label="Delete session"
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-ink-faint dark:text-paper-dark/40 hover:text-incorrect hover:bg-incorrect/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
