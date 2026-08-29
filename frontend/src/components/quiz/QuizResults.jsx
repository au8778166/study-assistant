export default function QuizResults({
  questions,
  answers,
  onRetestWrong,
  onRestart,
}) {
  const total = questions.length;

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  const wrongQuestions = questions.filter(
    (q) => answers[q.id] !== q.correctIndex
  );

  const pct =
    total === 0
      ? 0
      : Math.round((correctCount / total) * 100);

  const tone =
    pct >= 80
      ? "text-correct"
      : pct >= 50
        ? "text-highlight"
        : "text-incorrect";

  const message =
    pct === 100
      ? "Perfect score."
      : pct >= 80
        ? "Great work. You know this well."
        : pct >= 50
          ? "Good start. A little more review will help."
          : "Keep practicing. You'll get there.";

  return (
    <div className="animate-popIn">

      {/* ================= SCORE ================= */}

      <div
        className="
          rounded-3xl
          border border-ink/10 dark:border-paper/10
          bg-paper-panel dark:bg-night-panel
          p-7 sm:p-10
          text-center
        "
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint dark:text-paper-dark/40 mb-5">
          Quiz complete
        </p>

        <div
          className={`
            mx-auto
            w-36 h-36
            rounded-full
            border-[5px]
            ${tone}
            border-current
            flex flex-col items-center justify-center
            animate-stampIn
            -rotate-3
          `}
        >
          <span className="font-display font-bold text-4xl">
            {pct}%
          </span>

          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/50 mt-1">
            {correctCount} / {total}
          </span>
        </div>

        <p className="font-display text-xl text-ink dark:text-paper mt-6">
          {message}
        </p>

        <p className="font-body text-sm text-ink-soft dark:text-paper-dark/60 mt-2">
          {wrongQuestions.length === 0
            ? "You answered every question correctly."
            : `${wrongQuestions.length} question${
                wrongQuestions.length === 1 ? "" : "s"
              } worth reviewing.`}
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-3 flex-wrap mt-7">

          {wrongQuestions.length > 0 && (
            <button
              type="button"
              onClick={onRetestWrong}
              className="
                px-5 py-2.5
                rounded-full
                text-sm
                font-mono
                font-bold
                bg-incorrect
                text-paper
                hover:opacity-90
                active:scale-[0.97]
                transition-all
                shadow-card
              "
            >
              Review {wrongQuestions.length} missed
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="
              px-5 py-2.5
              rounded-full
              text-sm
              font-mono
              font-bold
              border border-ink/20 dark:border-paper/20
              text-ink dark:text-paper
              hover:bg-ink/5 dark:hover:bg-paper/10
              active:scale-[0.97]
              transition-all
            "
          >
            Retake quiz
          </button>
        </div>
      </div>

      {/* ================= REVIEW ================= */}

      {questions.length > 0 && (
        <div className="mt-8">

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint dark:text-paper-dark/40">
                Review
              </p>

              <h3 className="font-display text-xl text-ink dark:text-paper">
                Your answers
              </h3>
            </div>

            <span className="font-mono text-xs text-ink-faint dark:text-paper-dark/40">
              {correctCount}/{total} correct
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const isCorrect =
                answers[q.id] === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`
                    rounded-2xl
                    border
                    p-4 sm:p-5
                    ${
                      isCorrect
                        ? "border-correct/20 bg-correct/[0.03]"
                        : "border-incorrect/20 bg-incorrect/[0.03]"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">

                    {/* Status */}
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
                      {isCorrect ? "✓" : "×"}
                    </div>

                    <div className="flex-1 min-w-0">

                      {/* Question */}
                      <p className="font-body text-[15px] leading-relaxed text-ink dark:text-paper">
                        <span className="font-mono text-xs text-ink-faint dark:text-paper-dark/40 mr-1">
                          {String(i + 1).padStart(2, "0")}.
                        </span>

                        {q.question}
                      </p>

                      {/* User answer */}
                      <div className="mt-3">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
                          Your answer
                        </span>

                        <p
                          className={`
                            font-body text-sm mt-0.5
                            ${
                              isCorrect
                                ? "text-correct"
                                : "text-incorrect"
                            }
                          `}
                        >
                          {answers[q.id] !== undefined
                            ? q.options[answers[q.id]]
                            : "Skipped"}
                        </p>
                      </div>

                      {/* Correct answer */}
                      {!isCorrect && (
                        <div className="mt-2">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-correct">
                            Correct answer
                          </span>

                          <p className="font-body text-sm text-correct mt-0.5">
                            {q.options[q.correctIndex]}
                          </p>
                        </div>
                      )}

                      {/* Explanation */}
                      {q.explanation && (
                        <p className="font-body text-xs leading-relaxed text-ink-soft dark:text-paper-dark/50 mt-3 pt-3 border-t border-ink/5 dark:border-paper/5">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}