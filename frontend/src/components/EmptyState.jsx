const FEATURES = {
  flashcards: [
    "AI-generated cards",
    "Flip to reveal answers",
    "Mark cards you know",
    "Review cards you missed",
  ],
  quiz: [
    "AI-generated questions",
    "4 multiple-choice options",
    "Instant explanations",
    "Retest wrong answers",
  ],
};

export default function EmptyState({ mode }) {
  const isQuiz = mode === "quiz";
  const features = FEATURES[mode];

  return (
    <section
      className="
        px-5 sm:px-8
        max-w-5xl
        mx-auto
        w-full
        mt-6
        pb-16
      "
    >
      <div
        className="
          relative
          overflow-hidden
          border
          border-ink/10
          dark:border-night-border
          rounded-3xl
          bg-paper-panel
          dark:bg-night-panel
          shadow-card
          px-6
          py-12
          sm:px-12
          sm:py-16
          text-center
          animate-popIn
        "
      >
        {/* Decorative background */}

        <div
          className="
            absolute
            -top-24
            -right-24
            w-48
            h-48
            rounded-full
            bg-highlight/10
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            -bottom-24
            -left-24
            w-48
            h-48
            rounded-full
            bg-highlight/5
            blur-3xl
            pointer-events-none
          "
        />

        {/* Icon */}

        <div
          className="
            relative
            mx-auto
            w-16
            h-16
            rounded-2xl
            border
            border-ink/10
            dark:border-paper/15
            bg-paper
            dark:bg-night
            flex
            items-center
            justify-center
            mb-6
            shadow-sm
          "
        >
          {isQuiz ? (
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-ink dark:text-paper"
            >
              <path
                d="M9 10a3 3 0 1 1 3 3v1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 17.2v.1"
                strokeLinecap="round"
              />
              <path
                d="M4 5h16v14H4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-ink dark:text-paper"
            >
              <path
                d="M4 6h13a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M4 6a2 2 0 0 1 2-2h2v16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Eyebrow */}

        <p
          className="
            font-mono
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-highlight
            mb-3
          "
        >
          {isQuiz
            ? "Quiz mode"
            : "Flashcard mode"}
        </p>

        {/* Heading */}

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
          Turn your notes into{" "}
          {isQuiz ? "a quiz" : "flashcards"}
        </h2>

        {/* Description */}

        <p
          className="
            font-body
            text-[15px]
            leading-relaxed
            text-ink-soft
            dark:text-paper-dark/70
            max-w-lg
            mx-auto
            mt-3
          "
        >
          Paste your notes or enter a topic above.
          The AI will transform them into material
          you can actively study and review.
        </p>

        {/* Features */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-2
            max-w-lg
            mx-auto
            mt-8
            text-left
          "
        >
          {features.map((feature, index) => (
            <div
              key={feature}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-ink/5
                dark:border-paper/10
                bg-ink/[0.02]
                dark:bg-paper/[0.03]
                px-3.5
                py-3
              "
            >
              <span
                className="
                  shrink-0
                  w-5
                  h-5
                  rounded-full
                  bg-correct/10
                  text-correct
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                "
              >
                ✓
              </span>

              <span
                className="
                  font-mono
                  text-[11px]
                  text-ink-soft
                  dark:text-paper-dark/65
                "
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom hint */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-2
            text-ink-faint
            dark:text-paper-dark/40
          "
        >
          <span className="text-sm">↑</span>

          <span
            className="
              font-mono
              text-[10px]
              uppercase
              tracking-widest
            "
          >
            Start by adding your notes above
          </span>
        </div>
      </div>
    </section>
  );
}