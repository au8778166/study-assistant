import { useEffect, useState } from "react";
import QuizQuestion from "./QuizQuestion.jsx";
import QuizResults from "./QuizResults.jsx";

export default function QuizView({ studySet }) {
  const [pool, setPool] = useState(studySet.questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState("full");

  useEffect(() => {
    setPool(studySet.questions);
    setIndex(0);
    setAnswers({});
    setRevealed(false);
    setFinished(false);
    setRound("full");
  }, [studySet]);

  const current = pool[index];

  const answeredCount = Object.keys(answers).length;

  const correctCount = pool.filter(
    (question) =>
      answers[question.id] === question.correctIndex
  ).length;

  const progress =
    pool.length > 0
      ? ((index + (revealed ? 1 : 0)) / pool.length) *
        100
      : 0;

  function handleSelect(optionIndex) {
    if (revealed) return;

    setAnswers((prev) => ({
      ...prev,
      [current.id]: optionIndex,
    }));

    setRevealed(true);
  }

  function handleNext() {
    if (index < pool.length - 1) {
      setIndex((prev) => prev + 1);
      setRevealed(false);
    } else {
      setFinished(true);
    }
  }

  function handleRetestWrong(wrongQuestions) {
    setPool(wrongQuestions);

    setAnswers({});

    setIndex(0);
    setRevealed(false);
    setFinished(false);

    setRound("retest");
  }

  function handleRestartFull() {
    setPool(studySet.questions);
    setAnswers({});
    setIndex(0);
    setRevealed(false);
    setFinished(false);
    setRound("full");
  }

  if (!current && !finished) {
    return null;
  }

  return (
    <section className="px-5 sm:px-8 max-w-3xl mx-auto w-full mt-6 pb-20">

      {/* ================= HEADER ================= */}

      <div className="mb-5">
        <div className="flex items-center justify-between gap-3">

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-highlight" />

              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint dark:text-paper-dark/40">
                {round === "retest"
                  ? "Retest session"
                  : "Quiz session"}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl text-ink dark:text-paper">
              {studySet.title}
            </h2>
          </div>

          {!finished && (
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
                Score
              </p>

              <p className="font-display text-lg text-correct">
                {correctCount}
                <span className="text-ink-faint dark:text-paper-dark/30">
                  {" "}
                  / {answeredCount}
                </span>
              </p>
            </div>
          )}
        </div>

        {round === "retest" && !finished && (
          <div className="mt-2">
            <span className="inline-flex px-2.5 py-1 rounded-full bg-incorrect/10 text-incorrect font-mono text-[10px] uppercase tracking-widest">
              Focus: missed questions
            </span>
          </div>
        )}
      </div>

      {/* ================= PROGRESS ================= */}

      {!finished && (
        <div className="mb-7">

          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
              Progress
            </span>

            <span className="font-mono text-[10px] text-ink-faint dark:text-paper-dark/40">
              {index + 1} / {pool.length}
            </span>
          </div>

          <div className="h-2 rounded-full bg-ink/5 dark:bg-paper/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-highlight transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ================= RESULTS ================= */}

      {finished ? (
        <QuizResults
          questions={pool}
          answers={answers}
          onRetestWrong={() =>
            handleRetestWrong(
              pool.filter(
                (question) =>
                  answers[question.id] !==
                  question.correctIndex
              )
            )
          }
          onRestart={handleRestartFull}
        />
      ) : (
        <>
          {/* Question */}
          <QuizQuestion
            question={current}
            index={index}
            total={pool.length}
            selected={answers[current.id]}
            onSelect={handleSelect}
            revealed={revealed}
          />

          {/* Next */}
          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={handleNext}
              disabled={!revealed}
              className="
                group
                px-5 py-2.5
                rounded-full
                text-sm
                font-mono
                font-bold
                bg-ink text-paper
                dark:bg-highlight dark:text-graphite
                disabled:opacity-30
                disabled:cursor-not-allowed
                hover:opacity-90
                active:scale-[0.97]
                transition-all
              "
            >
              {index < pool.length - 1
                ? "Next question"
                : "See results"}

              <span className="ml-2 group-hover:translate-x-0.5 inline-block transition-transform">
                →
              </span>
            </button>
          </div>

          {/* Hint */}
          {!revealed && (
            <p className="text-center mt-4 font-mono text-[9px] uppercase tracking-widest text-ink-faint/50 dark:text-paper-dark/30">
              Select an answer to continue
            </p>
          )}
        </>
      )}
    </section>
  );
}