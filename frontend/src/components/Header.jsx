export default function Header({ theme, onToggleTheme }) {
  return (
    <header
      className="
        px-5 sm:px-8
        pt-7 sm:pt-9
        pb-6
        max-w-5xl
        mx-auto
        w-full
      "
    >
      <div className="flex items-start justify-between gap-6">

        {/* Brand */}

        <div className="min-w-0">

          {/* Small label */}

          <div
            className="
              flex
              items-center
              gap-2
              text-[10px]
              sm:text-[11px]
              tracking-[0.2em]
              uppercase
              text-ink-faint
              dark:text-paper-dark/60
              font-mono
              mb-2.5
            "
          >
            <span
              className="
                relative
                inline-flex
                w-2
                h-2
                rounded-full
                bg-highlight
              "
            >
              <span
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-highlight
                  animate-ping
                  opacity-40
                "
              />
            </span>

            AI study kit
          </div>

          {/* Logo */}

          <h1
            className="
              font-display
              font-bold
              text-3xl
              sm:text-4xl
              tracking-tight
              text-ink
              dark:text-paper
              leading-none
            "
          >
            INDEX
          </h1>

          {/* Description */}

          <p
            className="
              mt-2.5
              text-sm
              sm:text-[15px]
              leading-relaxed
              text-ink-soft
              dark:text-paper-dark/70
              max-w-lg
              font-body
            "
          >
            Turn your notes into focused study
            material — flashcards or quizzes,
            generated in seconds.
          </p>

          {/* Feature tags */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              mt-4
            "
          >
            <span
              className="
                px-2.5
                py-1
                rounded-full
                border
                border-ink/10
                dark:border-paper/10
                font-mono
                text-[10px]
                uppercase
                tracking-wider
                text-ink-soft
                dark:text-paper-dark/60
              "
            >
              ✦ AI generated
            </span>

            <span
              className="
                px-2.5
                py-1
                rounded-full
                border
                border-ink/10
                dark:border-paper/10
                font-mono
                text-[10px]
                uppercase
                tracking-wider
                text-ink-soft
                dark:text-paper-dark/60
              "
            >
              ↻ Retest
            </span>

            <span
              className="
                px-2.5
                py-1
                rounded-full
                border
                border-ink/10
                dark:border-paper/10
                font-mono
                text-[10px]
                uppercase
                tracking-wider
                text-ink-soft
                dark:text-paper-dark/60
              "
            >
              ⚡ Fast
            </span>
          </div>

        </div>

        {/* Theme button */}

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="
            group
            shrink-0
            mt-0.5
            w-10
            h-10
            rounded-full
            border
            border-ink/15
            dark:border-paper/20
            flex
            items-center
            justify-center
            text-ink
            dark:text-paper
            hover:bg-ink/5
            dark:hover:bg-paper/10
            hover:border-ink/30
            dark:hover:border-paper/30
            transition-all
            duration-200
          "
        >

          {theme === "dark" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="
                group-hover:rotate-45
                transition-transform
                duration-300
              "
            >
              <circle
                cx="12"
                cy="12"
                r="4.5"
              />

              <path
                d="
                  M12 2.5v2
                  M12 19.5v2
                  M4.2 4.2l1.4 1.4
                  M18.4 18.4l1.4 1.4
                  M2.5 12h2
                  M19.5 12h2
                  M4.2 19.8l1.4-1.4
                  M18.4 5.6l1.4-1.4
                "
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="
                group-hover:-rotate-12
                transition-transform
                duration-300
              "
            >
              <path
                d="
                  M20 14.5
                  A8.5 8.5 0 1 1 9.5 4
                  A6.8 6.8 0 0 0 20 14.5Z
                "
                strokeLinejoin="round"
              />
            </svg>
          )}

        </button>

      </div>
    </header>
  );
}