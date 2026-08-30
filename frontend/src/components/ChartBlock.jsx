export default function ChartBlock({ block }) {
  const max = Math.max(...block.values, 1);

  return (
    <section className="px-5 sm:px-8 max-w-3xl mx-auto w-full mt-6">
      <div className="bg-paper-panel dark:bg-night-panel border border-ink/10 dark:border-night-border rounded-2xl p-5 sm:p-6 shadow-card">

        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/50">
          Chart
        </span>

        <h2 className="font-display font-bold text-xl text-ink dark:text-paper mt-1 mb-6">
          {block.title}
        </h2>

        <div className="space-y-4">
          {block.labels.map((label, index) => {
            const value = block.values[index];
            const width = `${(value / max) * 100}%`;

            return (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-sm text-ink dark:text-paper">
                    {label}
                  </span>

                  <span className="font-mono text-xs text-ink-soft dark:text-paper-dark/60">
                    {value}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-ink/10 dark:bg-paper/10 overflow-hidden">
                  <div
                    className="h-full bg-highlight rounded-full transition-all duration-700"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}