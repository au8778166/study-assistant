const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizQuestion({
  question,
  index,
  total,
  selected,
  onSelect,
  revealed,
}) {
  const isCorrect = selected === question.correctIndex;

  return (
    <div
      className="
        bg-paper-panel dark:bg-night-panel
        border border-ink/10 dark:border-night-border
        rounded-3xl
        shadow-card
        p-5 sm:p-7
        animate-popIn
      "
    >
      {/* Question header */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div className="flex items-center gap-3">
          <span
            className="
              shrink-0
              w-9 h-9
              rounded-full
              bg-ink text-paper
              dark:bg-highlight dark:text-graphite
              flex items-center justify-center
              font-mono text-xs font-bold
            "
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint dark:text-paper-dark/40">
              Question
            </p>

            <p className="font-mono text-[10px] text-ink-faint dark:text-paper-dark/30 mt-0.5">
              {index + 1} of {total}
            </p>
          </div>
        </div>

        {revealed && (
          <span
            className={`
              shrink-0
              px-3 py-1
              rounded-full
              font-mono text-[10px]
              uppercase tracking-widest
              ${
                isCorrect
                  ? "bg-correct/10 text-correct"
                  : "bg-incorrect/10 text-incorrect"
              }
            `}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      {/* Question */}
      <h2
        className="
          font-display
          text-xl sm:text-2xl
          leading-snug
          text-ink dark:text-paper
          mb-7
        "
      >
        {question.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectOption = i === question.correctIndex;

          let containerClass =
            "border-ink/10 dark:border-paper/10 hover:border-ink/30 dark:hover:border-paper/30 hover:bg-ink/[0.025] dark:hover:bg-paper/[0.025]";

          let letterClass =
            "border-ink/20 dark:border-paper/20 text-ink-soft dark:text-paper-dark/60";

          if (!revealed && isSelected) {
            containerClass =
              "border-ink dark:border-highlight bg-ink/[0.04] dark:bg-highlight/[0.08]";

            letterClass =
              "border-ink dark:border-highlight bg-ink dark:bg-highlight text-paper dark:text-graphite";
          }

          if (revealed && isCorrectOption) {
            containerClass =
              "border-correct/50 bg-correct/10";

            letterClass =
              "border-correct bg-correct text-paper";
          }

          if (revealed && isSelected && !isCorrectOption) {
            containerClass =
              "border-incorrect/50 bg-incorrect/10";

            letterClass =
              "border-incorrect bg-incorrect text-paper";
          }

          if (
            revealed &&
            !isSelected &&
            !isCorrectOption
          ) {
            containerClass =
              "border-ink/5 dark:border-paper/5 opacity-50";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(i)}
              className={`
                group
                w-full
                flex items-center gap-3
                text-left
                px-4 py-3.5
                rounded-2xl
                border
                transition-all duration-200
                ${containerClass}
                ${!revealed ? "active:scale-[0.99]" : ""}
              `}
            >
              {/* Letter */}
              <span
                className={`
                  shrink-0
                  w-8 h-8
                  rounded-lg
                  border
                  flex items-center justify-center
                  font-mono text-xs font-bold
                  transition-all
                  ${letterClass}
                `}
              >
                {revealed && isCorrectOption
                  ? "✓"
                  : revealed &&
                      isSelected &&
                      !isCorrectOption
                    ? "×"
                    : LETTERS[i]}
              </span>

              {/* Option */}
              <span
                className={`
                  flex-1
                  font-body
                  text-[15px]
                  leading-relaxed
                  ${
                    revealed && isCorrectOption
                      ? "text-correct"
                      : revealed &&
                          isSelected &&
                          !isCorrectOption
                        ? "text-incorrect"
                        : "text-ink dark:text-paper"
                  }
                `}
              >
                {option}
              </span>

              {/* Correct indicator */}
              {revealed && isCorrectOption && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-correct">
                  Correct
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {revealed && (
        <div
          className={`
            mt-5
            rounded-2xl
            p-4
            border
            animate-popIn
            ${
              isCorrect
                ? "border-correct/20 bg-correct/[0.04]"
                : "border-incorrect/20 bg-incorrect/[0.04]"
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div
              className={`
                shrink-0
                w-7 h-7
                rounded-full
                flex items-center justify-center
                text-paper text-xs
                ${
                  isCorrect
                    ? "bg-correct"
                    : "bg-incorrect"
                }
              `}
            >
              {isCorrect ? "✓" : "!"}
            </div>

            <div>
              <p
                className={`
                  font-mono text-[10px]
                  uppercase tracking-widest
                  mb-1
                  ${
                    isCorrect
                      ? "text-correct"
                      : "text-incorrect"
                  }
                `}
              >
                {isCorrect
                  ? "Nice work"
                  : "Keep learning"}
              </p>

              {question.explanation && (
                <p className="font-body text-sm leading-relaxed text-ink-soft dark:text-paper-dark/70">
                  {question.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}