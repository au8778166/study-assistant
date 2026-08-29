const COPY = {
  network: {
    title: "Couldn't reach the server",
    hint: "Check that the backend is running (npm run server) and that you're online.",
  },
  timeout: {
    title: "The model took too long",
    hint: "This happens more with slower local models. Try again, or ask for fewer cards.",
  },
  server: {
    title: "The server ran into a problem",
    hint: "Check the backend terminal for details \u2014 it's often a missing or invalid API key.",
  },
  shape: {
    title: "The model's answer didn't fit the format",
    hint: "Smaller models sometimes wander off-schema. Retrying almost always fixes this.",
  },
  cancelled: {
    title: "Request cancelled",
    hint: "",
  },
};

export default function ErrorState({ error, onRetry }) {
  const copy = COPY[error?.type] || COPY.server;

  return (
    <div className="px-5 sm:px-8 max-w-5xl mx-auto w-full mt-6" role="alert">
      <div className="border border-incorrect/40 bg-incorrect/[0.06] dark:bg-incorrect/10 rounded-2xl p-5 sm:p-6 animate-popIn">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-incorrect/15 flex items-center justify-center mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B33A3A" strokeWidth="2">
              <path d="M12 8v5M12 16h.01M4 5h16v14H4z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-sm text-incorrect uppercase tracking-wide">{copy.title}</h3>
            <p className="font-body text-[15px] text-ink-soft dark:text-paper-dark/80 mt-1">{error?.message}</p>
            {copy.hint && <p className="font-body text-sm text-ink-faint dark:text-paper-dark/50 mt-1">{copy.hint}</p>}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-full text-sm font-mono font-bold bg-ink text-paper dark:bg-highlight dark:text-graphite hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
