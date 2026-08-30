import { useEffect, useRef, useState } from "react";

import Header from "./components/Header.jsx";
import InputPanel from "./components/InputPanel.jsx";
import EmptyState from "./components/EmptyState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import SessionHistory from "./components/SessionHistory.jsx";

import FlashcardDeck from "./components/flashcards/FlashcardDeck.jsx";
import QuizView from "./components/quiz/QuizView.jsx";

import { generateStudySet, ApiError } from "./lib/api.js";

import {
  loadSessions,
  saveSession,
  deleteSession,
  loadTheme,
  saveTheme,
} from "./lib/storage.js";

export default function App() {
  /* =========================================================
     INPUT STATE
  ========================================================= */

  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState("flashcards");
  const [count, setCount] = useState(8);

  /* =========================================================
     APPLICATION STATE
  ========================================================= */

  const [status, setStatus] = useState("idle");
  const [studySet, setStudySet] = useState(null);
  const [error, setError] = useState(null);

  /* =========================================================
     SESSION HISTORY
  ========================================================= */

  const [sessions, setSessions] = useState(() => loadSessions());

  /* =========================================================
     THEME
  ========================================================= */

  const [theme, setTheme] = useState(() => {
    return (
      loadTheme() ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  /* =========================================================
     REQUEST CONTROL
  ========================================================= */

  // Prevent an older API request from replacing a newer result.
  const requestIdRef = useRef(0);

  // Used to cancel an active API request.
  const abortRef = useRef(null);

  /* =========================================================
     THEME EFFECT
  ========================================================= */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    saveTheme(theme);
  }, [theme]);

  /* =========================================================
     GENERATE STUDY SET
  ========================================================= */

  async function runGenerate() {
    if (!notes.trim()) return;

    // Cancel previous request if one exists.
    abortRef.current?.abort();

    const controller = new AbortController();

    abortRef.current = controller;

    // Create a unique ID for this request.
    const myId = ++requestIdRef.current;

    setStatus("loading");
    setError(null);

    try {
      const result = await generateStudySet({
        notes: notes.trim(),
        mode,
        count,
        signal: controller.signal,
      });

      // Ignore stale responses.
      if (requestIdRef.current !== myId) {
        return;
      }

      setStudySet(result);
      setStatus("success");

      /* -----------------------------------------
         Save generated session
      ----------------------------------------- */

      const saved = saveSession({
        notes: notes.trim(),
        mode,
        count,
        studySet: result,
      });

      if (saved) {
        setSessions(loadSessions());
      }

      /* -----------------------------------------
         Scroll to result
      ----------------------------------------- */

      setTimeout(() => {
        document
          .getElementById("study-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (err) {
      // Ignore stale request errors.
      if (requestIdRef.current !== myId) {
        return;
      }

      // Ignore cancellation errors.
      if (
        err instanceof ApiError &&
        err.type === "cancelled"
      ) {
        return;
      }

      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(
              "server",
              "Something unexpected went wrong."
            );

      setError(apiError);
      setStatus("error");
    }
  }

  /* =========================================================
     CANCEL GENERATION
  ========================================================= */

  function handleCancel() {
    abortRef.current?.abort();

    // Invalidate current request.
    requestIdRef.current++;

    setStatus(
      studySet
        ? "success"
        : "idle"
    );
  }

  /* =========================================================
     CREATE NEW STUDY SET
  ========================================================= */

  function handleNewSet() {
    abortRef.current?.abort();

    requestIdRef.current++;

    setNotes("");
    setMode("flashcards");
    setCount(8);

    setStudySet(null);
    setError(null);
    setStatus("idle");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     LOAD SESSION FROM HISTORY
  ========================================================= */

  function handleLoadSession(session) {
    abortRef.current?.abort();

    requestIdRef.current++;

    setNotes(session.notes);
    setMode(session.mode);
    setCount(session.count);

    setStudySet(session.studySet);
    setStatus("success");
    setError(null);

    setTimeout(() => {
      document
        .getElementById("study-result")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  /* =========================================================
     DELETE SESSION
  ========================================================= */

  function handleDeleteSession(id) {
    deleteSession(id);

    setSessions(loadSessions());
  }

  /* =========================================================
     TOGGLE THEME
  ========================================================= */

  function handleToggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  }

  /* =========================================================
     RENDER STUDY RESULT
  ========================================================= */

  function renderStudyResult() {
    if (!studySet) return null;

    /*
      Currently supported block types:

      flashcards
      quiz

      Later we can extend this to:

      checklist
      summary
      chart
      matching
      true/false
      etc.
    */

    switch (studySet.kind) {
      case "quiz":
        return (
          <QuizView
            studySet={studySet}
          />
        );

      case "flashcards":
        return (
          <FlashcardDeck
            studySet={studySet}
          />
        );

      default:
        return (
          <div className="max-w-3xl mx-auto px-5 py-10 text-center">
            <p className="font-mono text-sm text-incorrect">
              Unsupported study material type.
            </p>
          </div>
        );
    }
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        bg-paper
        dark:bg-night
        bg-rule
        dark:bg-none
        transition-colors
        duration-300
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* =====================================================
          INPUT PANEL
      ===================================================== */}

      <div className="relative z-10">
        <InputPanel
          notes={notes}
          setNotes={setNotes}
          mode={mode}
          setMode={setMode}
          count={count}
          setCount={setCount}
          onGenerate={runGenerate}
          onCancel={handleCancel}
          isLoading={status === "loading"}
          hasResult={status === "success"}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        id="study-result"
        className="
          flex-1
          w-full
          scroll-mt-6
        "
      >

        {/* ===================================================
            IDLE STATE
        =================================================== */}

        {status === "idle" && (
          <div
            key="idle"
            className="animate-popIn"
          >
            <EmptyState
              mode={mode}
            />
          </div>
        )}

        {/* ===================================================
            LOADING STATE
        =================================================== */}

        {status === "loading" && (
          <div
            key="loading"
            className="animate-popIn"
          >
            <LoadingState
              mode={mode}
            />
          </div>
        )}

        {/* ===================================================
            ERROR STATE
        =================================================== */}

        {status === "error" && (
          <div
            key="error"
            className="animate-popIn"
          >
            <ErrorState
              error={error}
              onRetry={runGenerate}
            />
          </div>
        )}

        {/* ===================================================
            SUCCESS STATE
        =================================================== */}

        {status === "success" && studySet && (
          <div
            key="success"
            className="animate-popIn"
          >

            {/* Generated study material */}

            {renderStudyResult()}

            {/* =================================================
                CREATE NEW STUDY SET
            ================================================= */}

            <div className="flex justify-center pb-10 px-5">

              <button
                type="button"
                onClick={handleNewSet}
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  border
                  border-ink/10
                  dark:border-paper/10
                  text-ink-soft
                  dark:text-paper-dark/60
                  font-mono
                  text-xs
                  hover:border-ink/30
                  dark:hover:border-paper/30
                  hover:text-ink
                  dark:hover:text-paper
                  transition-all
                "
              >

                <span
                  className="
                    group-hover:rotate-90
                    transition-transform
                    duration-300
                  "
                >
                  +
                </span>

                Create new study set

              </button>

            </div>

          </div>
        )}

      </main>

      {/* =====================================================
          SESSION HISTORY
      ===================================================== */}

      <SessionHistory
        sessions={sessions}
        onLoad={handleLoadSession}
        onDelete={handleDeleteSession}
      />

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          mt-auto
          px-5
          sm:px-8
          py-8
          max-w-5xl
          mx-auto
          w-full
          text-center
        "
      >
        <p
          className="
            font-mono
            text-[11px]
            text-ink-faint
            dark:text-paper-dark/40
          "
        >
          Notes never leave your machine except to
          generate a set &mdash; nothing is stored on
          a server.
        </p>
      </footer>

    </div>
  );
}