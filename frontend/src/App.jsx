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
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState("flashcards");
  const [count, setCount] = useState(8);

  const [status, setStatus] = useState("idle");
  const [studySet, setStudySet] = useState(null);
  const [error, setError] = useState(null);

  const [sessions, setSessions] = useState(() =>
    loadSessions()
  );

  const [theme, setTheme] = useState(() =>
    loadTheme() ||
    (
      window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
    )
  );

  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  /* -------------------------------- */
  /* Theme                            */
  /* -------------------------------- */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    saveTheme(theme);
  }, [theme]);

  /* -------------------------------- */
  /* Generate                         */
  /* -------------------------------- */

  async function runGenerate() {
    if (!notes.trim()) return;

    abortRef.current?.abort();

    const controller = new AbortController();

    abortRef.current = controller;

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

      if (requestIdRef.current !== myId) {
        return;
      }

      setStudySet(result);
      setStatus("success");

      const saved = saveSession({
        notes: notes.trim(),
        mode,
        count,
        studySet: result,
      });

      if (saved) {
        setSessions(loadSessions());
      }

      // Scroll to generated content
      setTimeout(() => {
        document
          .getElementById("study-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (err) {
      if (requestIdRef.current !== myId) {
        return;
      }

      if (
        err instanceof ApiError &&
        err.type === "cancelled"
      ) {
        return;
      }

      setError(
        err instanceof ApiError
          ? err
          : new ApiError(
              "server",
              "Something unexpected went wrong."
            )
      );

      setStatus("error");
    }
  }

  /* -------------------------------- */
  /* Cancel                           */
  /* -------------------------------- */

  function handleCancel() {
    abortRef.current?.abort();

    requestIdRef.current++;

    setStatus(
      studySet
        ? "success"
        : "idle"
    );
  }

  /* -------------------------------- */
  /* New study set                    */
  /* -------------------------------- */

  function handleNewSet() {
    abortRef.current?.abort();

    requestIdRef.current++;

    setNotes("");
    setStudySet(null);
    setError(null);

    setStatus("idle");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* -------------------------------- */
  /* Load history                     */
  /* -------------------------------- */

  function handleLoadSession(session) {
    abortRef.current?.abort();

    requestIdRef.current++;

    setNotes(session.notes);
    setMode(session.mode);
    setCount(session.count);

    setStudySet(session.studySet);
    setStatus("success");
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* -------------------------------- */
  /* Delete history                   */
  /* -------------------------------- */

  function handleDeleteSession(id) {
    deleteSession(id);
    setSessions(loadSessions());
  }

  /* -------------------------------- */
  /* Render                           */
  /* -------------------------------- */

  return (
    <div
      className="
        min-h-screen
        flex flex-col
        bg-paper dark:bg-night
        bg-rule dark:bg-none
        transition-colors duration-300
      "
    >

      {/* ================= HEADER ================= */}

      <Header
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) =>
            t === "dark"
              ? "light"
              : "dark"
          )
        }
      />

      {/* ================= INPUT ================= */}

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

      {/* ================= MAIN ================= */}

      <main
        id="study-result"
        className="
          flex-1
          w-full
          scroll-mt-6
        "
      >

        {/* IDLE */}

        {status === "idle" && (
          <div
            key="idle"
            className="animate-popIn"
          >
            <EmptyState mode={mode} />
          </div>
        )}

        {/* LOADING */}

        {status === "loading" && (
          <div
            key="loading"
            className="animate-popIn"
          >
            <LoadingState mode={mode} />
          </div>
        )}

        {/* ERROR */}

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

        {/* SUCCESS */}

        {status === "success" && studySet && (
          <div
            key="success"
            className="animate-popIn"
          >
            {studySet.kind === "quiz" ? (
              <QuizView studySet={studySet} />
            ) : (
              <FlashcardDeck
                studySet={studySet}
              />
            )}

            {/* New set button */}

            <div className="flex justify-center pb-10">

              <button
                type="button"
                onClick={handleNewSet}
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
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

      {/* ================= HISTORY ================= */}

      <SessionHistory
        sessions={sessions}
        onLoad={handleLoadSession}
        onDelete={handleDeleteSession}
      />

      {/* ================= FOOTER ================= */}

      <footer
        className="
          mt-auto
          px-5 sm:px-8
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