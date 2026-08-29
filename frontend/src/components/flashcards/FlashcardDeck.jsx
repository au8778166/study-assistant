import { useEffect, useMemo, useState } from "react";
import Flashcard from "./Flashcard.jsx";

function shuffle(arr) {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

export default function FlashcardDeck({ studySet }) {
  const [order, setOrder] = useState(
    studySet.cards.map((card) => card.id)
  );

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [statusById, setStatusById] = useState({});
  const [reviewingUnknown, setReviewingUnknown] = useState(false);

  useEffect(() => {
    setOrder(studySet.cards.map((card) => card.id));
    setIndex(0);
    setFlipped(false);
    setStatusById({});
    setReviewingUnknown(false);
  }, [studySet]);

  const cardsById = useMemo(
    () =>
      Object.fromEntries(
        studySet.cards.map((card) => [card.id, card])
      ),
    [studySet]
  );

  const current = cardsById[order[index]];

  const knownCount = Object.values(statusById).filter(
    (status) => status === "known"
  ).length;

  const unknownCount = Object.values(statusById).filter(
    (status) => status === "unknown"
  ).length;

  const seenCount = Object.keys(statusById).length;

  const progress =
    order.length > 0
      ? (seenCount / order.length) * 100
      : 0;

  function goTo(next) {
    setFlipped(false);

    setIndex(
      ((next % order.length) + order.length) % order.length
    );
  }

  function mark(status) {
    setStatusById((prev) => ({
      ...prev,
      [current.id]: status,
    }));

    if (index < order.length - 1) {
      goTo(index + 1);
    } else {
      setFlipped(false);
    }
  }

  function handleShuffle() {
    setOrder(shuffle(order));
    setIndex(0);
    setFlipped(false);
  }

  function reviewUnknown() {
    const unknownIds = Object.entries(statusById)
      .filter(([, status]) => status === "unknown")
      .map(([id]) => id);

    if (unknownIds.length === 0) return;

    setOrder(shuffle(unknownIds));
    setIndex(0);
    setFlipped(false);
    setStatusById({});
    setReviewingUnknown(true);
  }

  function restartAll() {
    setOrder(
      shuffle(
        studySet.cards.map((card) => card.id)
      )
    );

    setIndex(0);
    setFlipped(false);
    setStatusById({});
    setReviewingUnknown(false);
  }

  if (!current) return null;

  const deckDone = seenCount === order.length;

  return (
    <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 mt-6 pb-20">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-highlight" />

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint dark:text-paper-dark/40">
              {reviewingUnknown
                ? "Review session"
                : "Flashcard session"}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-ink dark:text-paper">
            {studySet.title}
          </h2>

          {reviewingUnknown && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-incorrect">
              Reviewing missed cards
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">

          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
              Known
            </p>

            <p className="font-display text-lg text-correct">
              {knownCount}
            </p>
          </div>

          <div className="w-px h-8 bg-ink/10 dark:bg-paper/10" />

          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
              Review
            </p>

            <p className="font-display text-lg text-incorrect">
              {unknownCount}
            </p>
          </div>
        </div>
      </div>

      {/* ================= PROGRESS ================= */}

      <div className="mb-7">

        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint dark:text-paper-dark/40">
            Progress
          </span>

          <span className="font-mono text-[10px] text-ink-faint dark:text-paper-dark/40">
            {seenCount} / {order.length}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-ink/5 dark:bg-paper/5 overflow-hidden">
          <div
            className="h-full bg-highlight rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ================= COMPLETE ================= */}

      {deckDone ? (
        <div className="rounded-3xl border border-ink/10 dark:border-paper/10 bg-paper-panel dark:bg-night-panel px-6 py-14 text-center animate-popIn">

          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-correct/10 flex items-center justify-center">
            <span className="text-2xl text-correct">
              ✓
            </span>
          </div>

          <p className="font-display text-3xl text-ink dark:text-paper">
            Deck complete
          </p>

          <p className="mt-2 font-body text-sm text-ink-soft dark:text-paper-dark/60">
            You marked{" "}
            <strong>{knownCount}</strong> of{" "}
            <strong>{order.length}</strong> cards as known.
          </p>

          {unknownCount > 0 && (
            <p className="mt-1 font-body text-sm text-incorrect">
              {unknownCount} card
              {unknownCount === 1 ? "" : "s"} need another look.
            </p>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap mt-7">

            {unknownCount > 0 && (
              <button
                type="button"
                onClick={reviewUnknown}
                className="
                  px-5 py-2.5 rounded-full
                  text-sm font-mono font-bold
                  bg-incorrect text-paper
                  hover:opacity-90
                  active:scale-[0.97]
                  transition-all
                  shadow-card
                "
              >
                Review {unknownCount} missed
              </button>
            )}

            <button
              type="button"
              onClick={restartAll}
              className="
                px-5 py-2.5 rounded-full
                text-sm font-mono font-bold
                border border-ink/20 dark:border-paper/20
                text-ink dark:text-paper
                hover:bg-ink/5 dark:hover:bg-paper/10
                active:scale-[0.97]
                transition-all
              "
            >
              Restart deck
            </button>
          </div>
        </div>
      ) : (

        /* ================= ACTIVE CARD ================= */

        <>
          <div className="text-center mb-4">
            <span className="font-mono text-xs text-ink-faint dark:text-paper-dark/40">
              CARD{" "}
              <span className="text-ink dark:text-paper">
                {index + 1}
              </span>{" "}
              / {order.length}
            </span>
          </div>

          <Flashcard
            card={current}
            flipped={flipped}
            onFlip={() => setFlipped((value) => !value)}
            status={statusById[current.id]}
          />

          {/* ================= CONTROLS ================= */}

          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-7">

            {/* Previous */}
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous card"
              className="
                w-11 h-11
                rounded-full
                border border-ink/10 dark:border-paper/15
                text-ink dark:text-paper
                flex items-center justify-center
                hover:bg-ink/5 dark:hover:bg-paper/10
                disabled:opacity-25
                disabled:cursor-not-allowed
                transition-all
              "
            >
              ←
            </button>

            {/* Still learning */}
            <button
              type="button"
              onClick={() => mark("unknown")}
              className="
                px-4 sm:px-5 py-2.5
                rounded-full
                text-xs sm:text-sm
                font-mono
                border border-incorrect/30
                text-incorrect
                hover:bg-incorrect/10
                active:scale-[0.97]
                transition-all
              "
            >
              <span className="mr-1">○</span>
              Still learning
            </button>

            {/* Got it */}
            <button
              type="button"
              onClick={() => mark("known")}
              className="
                px-4 sm:px-5 py-2.5
                rounded-full
                text-xs sm:text-sm
                font-mono font-bold
                border border-correct/40
                text-correct
                hover:bg-correct/10
                active:scale-[0.97]
                transition-all
              "
            >
              <span className="mr-1">✓</span>
              Got it
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === order.length - 1}
              aria-label="Next card"
              className="
                w-11 h-11
                rounded-full
                border border-ink/10 dark:border-paper/15
                text-ink dark:text-paper
                flex items-center justify-center
                hover:bg-ink/5 dark:hover:bg-paper/10
                disabled:opacity-25
                disabled:cursor-not-allowed
                transition-all
              "
            >
              →
            </button>
          </div>

          {/* ================= SECONDARY ACTIONS ================= */}

          <div className="flex justify-center gap-5 mt-5">

            <button
              type="button"
              onClick={handleShuffle}
              className="
                font-mono text-[10px]
                uppercase tracking-widest
                text-ink-faint dark:text-paper-dark/40
                hover:text-ink dark:hover:text-paper
                flex items-center gap-2
                transition-colors
              "
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M4 4h4l12 16h-4M4 20h4L12 12M16 4h4v4M16 20h4v-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Shuffle
            </button>

            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="
                font-mono text-[10px]
                uppercase tracking-widest
                text-ink-faint dark:text-paper-dark/40
                hover:text-ink dark:hover:text-paper
                transition-colors
              "
            >
              {flipped ? "Show question" : "Show answer"}
            </button>
          </div>

          {/* Keyboard hint */}
          <div className="hidden sm:flex justify-center mt-5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint/50 dark:text-paper-dark/30">
              Click card to flip
            </span>
          </div>
        </>
      )}
    </section>
  );
}