import { useEffect, useState } from "react";

const FLASHCARD_STEPS = [
  "Reading your notes",
  "Finding key concepts",
  "Creating flashcards",
  "Polishing explanations",
];

const QUIZ_STEPS = [
  "Reading your notes",
  "Finding key concepts",
  "Writing questions",
  "Checking answer options",
];

export default function LoadingState({ mode }) {
  const steps =
    mode === "quiz"
      ? QUIZ_STEPS
      : FLASHCARD_STEPS;

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((current) =>
        current < steps.length - 1
          ? current + 1
          : current
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section
      className="
        px-5 sm:px-8
        max-w-5xl
        mx-auto
        w-full
        mt-8
        pb-16
      "
      aria-live="polite"
      aria-busy="true"
    >

      {/* Main loading card */}

      <div
        className="
          max-w-2xl
          mx-auto
          bg-paper-panel
          dark:bg-night-panel
          border
          border-ink/10
          dark:border-night-border
          rounded-3xl
          shadow-card
          p-7 sm:p-10
          text-center
          animate-popIn
        "
      >

        {/* Animated icon */}

        <div className="relative w-16 h-16 mx-auto mb-6">

          <div
            className="
              absolute
              inset-0
              rounded-full
              border-2
              border-ink/10
              dark:border-paper/10
            "
          />

          <div
            className="
              absolute
              inset-0
              rounded-full
              border-2
              border-transparent
              border-t-highlight
              animate-spin
            "
          />

          <div
            className="
              absolute
              inset-3
              rounded-full
              bg-highlight/10
              dark:bg-highlight/10
              flex
              items-center
              justify-center
            "
          >
            <span className="text-lg">
              ✦
            </span>
          </div>

        </div>

        {/* Heading */}

        <p
          className="
            font-mono
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-ink-faint
            dark:text-paper-dark/50
            mb-2
          "
        >
          AI Study Assistant
        </p>

        <h2
          className="
            font-display
            text-2xl
            sm:text-3xl
            font-bold
            text-ink
            dark:text-paper
          "
        >
          {mode === "quiz"
            ? "Building your quiz"
            : "Building your flashcards"}
        </h2>

        <p
          className="
            font-body
            text-sm
            text-ink-soft
            dark:text-paper-dark/60
            mt-2
          "
        >
          Turning your notes into something
          you can actually study.
        </p>

        {/* Progress */}

        <div className="mt-8 text-left">

          {steps.map((step, index) => {

            const completed =
              index < activeStep;

            const active =
              index === activeStep;

            return (
              <div
                key={step}
                className="
                  flex
                  items-center
                  gap-3
                  py-2
                "
              >

                {/* Status indicator */}

                <div
                  className={`
                    shrink-0
                    w-6
                    h-6
                    rounded-full
                    flex
                    items-center
                    justify-center
                    border
                    transition-all
                    duration-500

                    ${
                      completed
                        ? "bg-correct border-correct text-paper"
                        : active
                        ? "border-highlight text-highlight"
                        : "border-ink/15 dark:border-paper/15 text-ink-faint"
                    }
                  `}
                >

                  {completed ? (
                    <span className="text-xs">
                      ✓
                    </span>
                  ) : active ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
                  ) : (
                    <span className="text-[10px]">
                      {index + 1}
                    </span>
                  )}

                </div>

                {/* Step text */}

                <span
                  className={`
                    font-mono
                    text-xs
                    transition-all
                    duration-500

                    ${
                      completed
                        ? "text-correct"
                        : active
                        ? "text-ink dark:text-paper"
                        : "text-ink-faint dark:text-paper-dark/40"
                    }
                  `}
                >
                  {step}
                </span>

              </div>
            );
          })}

        </div>

        {/* Progress bar */}

        <div
          className="
            h-1
            bg-ink/5
            dark:bg-paper/5
            rounded-full
            overflow-hidden
            mt-6
          "
        >
          <div
            className="
              h-full
              bg-highlight
              transition-all
              duration-700
            "
            style={{
              width: `${Math.max(
                8,
                ((activeStep + 1) /
                  steps.length) *
                  100
              )}%`,
            }}
          />
        </div>

      </div>

      {/* Skeleton preview */}

      <div className="mt-8">

        <p
          className="
            font-mono
            text-[10px]
            uppercase
            tracking-widest
            text-ink-faint
            dark:text-paper-dark/40
            mb-3
          "
        >
          Preview
        </p>

        {mode === "quiz" ? (
          <div className="space-y-3">

            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="
                  bg-paper-panel
                  dark:bg-night-panel
                  border
                  border-ink/10
                  dark:border-night-border
                  rounded-2xl
                  p-5
                  animate-pulse
                "
                style={{
                  animationDelay: `${i * 150}ms`,
                }}
              >

                <div className="h-4 w-2/3 bg-ink/10 dark:bg-paper/10 rounded mb-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                  {Array.from({
                    length: 4,
                  }).map((__, j) => (
                    <div
                      key={j}
                      className="
                        h-9
                        bg-ink/5
                        dark:bg-paper/5
                        rounded-xl
                      "
                    />
                  ))}

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

            {Array.from({
              length: 6,
            }).map((_, i) => (
              <div
                key={i}
                className="
                  aspect-[4/3]
                  bg-paper-panel
                  dark:bg-night-panel
                  border
                  border-ink/10
                  dark:border-night-border
                  rounded-xl
                  animate-pulse
                "
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}

          </div>
        )}

      </div>

    </section>
  );
}