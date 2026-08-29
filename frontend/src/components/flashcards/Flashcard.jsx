export default function Flashcard({ card, flipped, onFlip, status }) {
  const ring =
    status === "known"
      ? "border-correct/70"
      : status === "unknown"
        ? "border-incorrect/70"
        : "border-ink/10 dark:border-night-border";

  return (
    <div className="perspective w-full max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? "Show question" : "Show answer"}
        className={`
          relative w-full
          min-h-[300px] sm:min-h-[360px]
          text-left
          preserve-3d
          transition-transform duration-500 ease-out
          ${flipped ? "rotate-y-180" : ""}
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ================= FRONT ================= */}
        <div
          className={`
            absolute inset-0
            backface-hidden
            bg-paper-panel dark:bg-night-panel
            border-2 ${ring}
            rounded-3xl
            shadow-card
            p-7 sm:p-10
            flex flex-col
            overflow-hidden
            transition-shadow duration-300
          `}
        >
          {/* Decorative top line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-ink/10 dark:bg-paper/10" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint dark:text-paper-dark/45">
              Question
            </span>

            <span className="font-mono text-[10px] text-ink-faint dark:text-paper-dark/35">
              {status === "known"
                ? "✓ Known"
                : status === "unknown"
                  ? "Review"
                  : "Active recall"}
            </span>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center py-10">
            <p className="font-display text-2xl sm:text-3xl leading-tight text-ink dark:text-paper text-center max-w-xl">
              {card.front}
            </p>
          </div>

          {/* Bottom hint */}
          <div className="flex items-center justify-center gap-2 text-ink-faint dark:text-paper-dark/40">
            <span className="w-1.5 h-1.5 rounded-full bg-ink/30 dark:bg-paper/30 animate-pulse" />

            <span className="font-mono text-[10px] uppercase tracking-widest">
              Click to reveal answer
            </span>
          </div>

          {/* Punch holes */}
          <div className="absolute left-0 top-10 bottom-10 w-3 flex flex-col justify-between">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="
                  w-3 h-3
                  rounded-full
                  bg-ink/10 dark:bg-paper/10
                  border border-ink/5 dark:border-paper/5
                "
              />
            ))}
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div
          className={`
            absolute inset-0
            backface-hidden
            rotate-y-180
            bg-ink dark:bg-highlight
            border-2 ${ring}
            rounded-3xl
            shadow-card
            p-7 sm:p-10
            flex flex-col
            overflow-hidden
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50 dark:text-graphite/50">
              Answer
            </span>

            <span className="font-mono text-[10px] text-paper/35 dark:text-graphite/40">
              Active recall
            </span>
          </div>

          {/* Answer */}
          <div className="flex-1 flex items-center justify-center py-10">
            <p className="font-body text-lg sm:text-xl leading-relaxed text-paper dark:text-graphite text-center max-w-xl">
              {card.back}
            </p>
          </div>

          {/* Bottom hint */}
          <div className="flex items-center justify-center gap-2 text-paper/40 dark:text-graphite/40">
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Click to see question
            </span>

            <span>↻</span>
          </div>
        </div>
      </button>
    </div>
  );
}