import { useState } from "react";

export default function ChecklistBlock({ block }) {
  const [checked, setChecked] = useState({});

  function toggle(index) {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  const completed = Object.values(checked).filter(Boolean).length;

  return (
    <section className="px-5 sm:px-8 max-w-3xl mx-auto w-full mt-6">
      <div className="bg-paper-panel dark:bg-night-panel border border-ink/10 dark:border-night-border rounded-2xl p-5 sm:p-6 shadow-card">

        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/50">
              Checklist
            </span>

            <h2 className="font-display font-bold text-xl text-ink dark:text-paper mt-1">
              {block.title}
            </h2>
          </div>

          <span className="font-mono text-xs text-ink-soft dark:text-paper-dark/60">
            {completed}/{block.items.length}
          </span>
        </div>

        <div className="space-y-2">
          {block.items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => toggle(index)}
              className={`w-full flex items-center gap-3 text-left p-3 rounded-xl border transition-all ${
                checked[index]
                  ? "border-correct/40 bg-correct/10"
                  : "border-ink/10 dark:border-paper/10 hover:border-ink/30 dark:hover:border-paper/30"
              }`}
            >
              <span
                className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                  checked[index]
                    ? "bg-correct border-correct text-paper"
                    : "border-ink/30 dark:border-paper/30"
                }`}
              >
                {checked[index] && "✓"}
              </span>

              <span
                className={`font-body text-[15px] ${
                  checked[index]
                    ? "line-through text-ink-soft dark:text-paper-dark/50"
                    : "text-ink dark:text-paper"
                }`}
              >
                {item}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}