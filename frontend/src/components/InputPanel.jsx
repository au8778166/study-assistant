const MAX_CHARS = 12000;

const EXAMPLES = [
  {
    title: "Water Cycle",
    text: "The water cycle: evaporation, condensation, precipitation, collection. Driven by solar energy and gravity.",
  },
  {
    title: "Spanish Verbs",
    text: "Spanish present-tense -AR verb conjugation: hablar → hablo, hablas, habla, hablamos, habláis, hablan.",
  },
  {
    title: "French Revolution",
    text: "Key events of the French Revolution, 1789–1799, from the storming of the Bastille to Napoleon's coup.",
  },
];

const MODES = [
  {
    id: "flashcards",
    icon: "▣",
    title: "Flashcards",
    description: "Learn with active recall",
  },
  {
    id: "quiz",
    icon: "✦",
    title: "Quiz",
    description: "Test what you know",
  },
];

export default function InputPanel({
  notes,
  setNotes,
  mode,
  setMode,
  count,
  setCount,
  onGenerate,
  onCancel,
  isLoading,
  hasResult,
}) {
  const charCount = notes.length;
  const overLimit = charCount > MAX_CHARS;
  const hasNotes = notes.trim().length > 0;

  const progress = Math.min((charCount / MAX_CHARS) * 100, 100);

  const generateLabel = isLoading
    ? "Creating..."
    : hasResult
      ? `Regenerate ${mode === "quiz" ? "Quiz" : "Cards"}`
      : `Generate ${mode === "quiz" ? "Quiz" : "Flashcards"}`;

  return (
    <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 pb-10">
      
      {/* Hero */}
      {!hasResult && (
        <div className="text-center mb-8 sm:mb-10 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink/10 dark:border-paper/10 bg-paper-panel/60 dark:bg-night-panel/60 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-paper-dark/60">
              AI-powered active recall
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight text-ink dark:text-paper">
            Turn notes into
            <br />
            <span className="italic text-ink-soft dark:text-paper-dark/70">
              active recall.
            </span>
          </h1>

          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-ink-soft dark:text-paper-dark/60">
            Paste your notes or name a topic. We'll turn them into
            interactive flashcards or a quiz.
          </p>
        </div>
      )}

      {/* Main panel */}
      <div className="relative bg-paper-panel dark:bg-night-panel border border-ink/10 dark:border-night-border rounded-3xl shadow-card overflow-hidden">
        
        {/* Top label */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-6 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint dark:text-paper-dark/40">
              Step 01
            </span>

            <h2 className="mt-1 font-display text-lg sm:text-xl text-ink dark:text-paper">
              What are you studying?
            </h2>
          </div>

          <span
            className={`font-mono text-xs ${
              overLimit
                ? "text-incorrect"
                : charCount > MAX_CHARS * 0.8
                  ? "text-ink-soft dark:text-paper-dark/70"
                  : "text-ink-faint dark:text-paper-dark/40"
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>

        {/* Text input */}
        <div className="px-5 sm:px-7 pt-4">
          <div
            className={`
              relative rounded-2xl border transition-all duration-300
              ${
                overLimit
                  ? "border-incorrect/50"
                  : "border-ink/10 dark:border-paper/10 focus-within:border-ink/30 dark:focus-within:border-paper/30"
              }
              bg-ink/[0.025] dark:bg-paper/[0.025]
            `}
          >
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here, or just name a topic..."
              rows={6}
              className="
                w-full resize-none bg-transparent
                px-4 pt-4 pb-8
                min-h-[150px] sm:min-h-[170px]
                font-body text-[15px] leading-relaxed
                text-ink dark:text-paper
                placeholder:text-ink-faint/60
                focus:outline-none
              "
            />

            {/* Character progress */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-ink/5 dark:bg-paper/5">
              <div
                className={`h-full transition-all duration-300 ${
                  overLimit ? "bg-incorrect" : "bg-highlight"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Examples */}
        {!hasNotes && (
          <div className="px-5 sm:px-7 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
                Try an example
              </span>

              <span className="h-px flex-1 bg-ink/5 dark:bg-paper/5" />
            </div>

            <div className="grid sm:grid-cols-3 gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example.title}
                  type="button"
                  onClick={() => setNotes(example.text)}
                  className="
                    group text-left p-3 rounded-xl
                    border border-ink/10 dark:border-paper/10
                    bg-ink/[0.02] dark:bg-paper/[0.02]
                    hover:bg-ink/[0.05] dark:hover:bg-paper/[0.05]
                    hover:border-ink/20 dark:hover:border-paper/20
                    transition-all duration-200
                    hover:-translate-y-0.5
                  "
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-ink dark:text-paper">
                      {example.title}
                    </span>

                    <span className="text-ink-faint group-hover:text-ink dark:group-hover:text-paper transition-colors">
                      →
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-ink-faint dark:text-paper-dark/50 line-clamp-2">
                    {example.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mx-5 sm:mx-7 h-px bg-ink/10 dark:bg-paper/10 my-5" />

        {/* Mode selection */}
        <div className="px-5 sm:px-7">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
                Step 02
              </span>

              <p className="mt-1 text-sm text-ink-soft dark:text-paper-dark/60">
                Choose how you want to learn
              </p>
            </div>

            <span className="hidden sm:block font-mono text-[10px] uppercase tracking-wider text-ink-faint dark:text-paper-dark/40">
              {count} {mode === "quiz" ? "questions" : "cards"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {MODES.map((item) => {
              const selected = mode === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  aria-pressed={selected}
                  className={`
                    relative group text-left rounded-2xl p-4 sm:p-5
                    border transition-all duration-300
                    ${
                      selected
                        ? "border-ink dark:border-highlight bg-ink dark:bg-highlight shadow-lg"
                        : "border-ink/10 dark:border-paper/10 bg-transparent hover:border-ink/25 dark:hover:border-paper/25 hover:-translate-y-0.5"
                    }
                  `}
                >
                  {/* Selected indicator */}
                  {selected && (
                    <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-paper/15 dark:bg-graphite/15">
                      <span className="text-xs">✓</span>
                    </span>
                  )}

                  <div
                    className={`
                      text-2xl mb-3 transition-transform duration-300
                      group-hover:scale-110 origin-left
                      ${
                        selected
                          ? "text-paper dark:text-graphite"
                          : "text-ink dark:text-paper"
                      }
                    `}
                  >
                    {item.icon}
                  </div>

                  <div
                    className={`
                      font-display text-lg
                      ${
                        selected
                          ? "text-paper dark:text-graphite"
                          : "text-ink dark:text-paper"
                      }
                    `}
                  >
                    {item.title}
                  </div>

                  <div
                    className={`
                      mt-1 text-xs
                      ${
                        selected
                          ? "text-paper/60 dark:text-graphite/60"
                          : "text-ink-faint dark:text-paper-dark/50"
                      }
                    `}
                  >
                    {item.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 sm:px-7 py-5 mt-1 flex flex-col sm:flex-row sm:items-center gap-4">
          
          {/* Count */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
              {mode === "quiz" ? "Questions" : "Cards"}
            </span>

            <div className="flex items-center rounded-full border border-ink/10 dark:border-paper/10 overflow-hidden">
              <button
                type="button"
                aria-label="Decrease count"
                disabled={count <= 3 || isLoading}
                onClick={() => setCount(Math.max(3, count - 1))}
                className="
                  w-9 h-8 flex items-center justify-center
                  text-ink dark:text-paper
                  hover:bg-ink/5 dark:hover:bg-paper/10
                  disabled:opacity-30
                  transition-colors
                "
              >
                −
              </button>

              <span className="w-9 text-center font-mono text-sm text-ink dark:text-paper">
                {count}
              </span>

              <button
                type="button"
                aria-label="Increase count"
                disabled={count >= 20 || isLoading}
                onClick={() => setCount(Math.min(20, count + 1))}
                className="
                  w-9 h-8 flex items-center justify-center
                  text-ink dark:text-paper
                  hover:bg-ink/5 dark:hover:bg-paper/10
                  disabled:opacity-30
                  transition-colors
                "
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="sm:ml-auto flex items-center gap-2">
            {isLoading && (
              <button
                type="button"
                onClick={onCancel}
                className="
                  px-4 py-2.5 rounded-full
                  text-sm font-mono
                  border border-ink/15 dark:border-paper/15
                  text-ink-soft dark:text-paper-dark/70
                  hover:text-ink dark:hover:text-paper
                  transition-colors
                "
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={onGenerate}
              disabled={isLoading || !hasNotes || overLimit}
              className="
                group relative overflow-hidden
                px-6 py-2.5 rounded-full
                text-sm font-mono font-bold
                bg-ink text-paper
                dark:bg-highlight dark:text-graphite
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:shadow-lg
                active:scale-[0.97]
                transition-all duration-200
              "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {generateLabel}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Small footer hint */}
      {!hasResult && (
        <div className="mt-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/30">
            {mode === "quiz"
              ? "AI-generated multiple choice questions"
              : "AI-generated active recall cards"}
          </span>
        </div>
      )}
    </section>
  );
}