/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        /* =========================
           PAPER / CREAM
        ========================= */
        paper: {
          DEFAULT: "#F4EFE6",
          dark: "#E8DED0",
          panel: "#FBF8F2",
        },

        /* =========================
           WARM CHARCOAL / INK
        ========================= */
        ink: {
          DEFAULT: "#332C2A",
          soft: "#665B55",
          faint: "#9A8F87",
        },

        /* =========================
           MAIN ACCENT
           TERRACOTTA
        ========================= */
        highlight: "#C96B4B",

        /* =========================
           FEEDBACK COLORS
        ========================= */
        correct: "#587A5A",
        incorrect: "#B8544B",

        /* =========================
           DARK TEXT
        ========================= */
        graphite: "#332C2A",

        /* =========================
           DARK MODE
        ========================= */
        night: {
          DEFAULT: "#252220",
          panel: "#302B28",
          border: "#49413D",
        },
      },

      fontFamily: {
        display: [
          "'Space Mono'",
          "monospace",
        ],

        body: [
          "'Source Serif 4'",
          "Georgia",
          "serif",
        ],

        mono: [
          "'JetBrains Mono'",
          "monospace",
        ],
      },

      boxShadow: {
        card:
          "0 1px 0 rgba(51,44,42,0.06), 0 6px 16px rgba(51,44,42,0.08)",

        cardHover:
          "0 2px 0 rgba(51,44,42,0.08), 0 12px 28px rgba(51,44,42,0.14)",

        punch:
          "inset 0 1px 2px rgba(0,0,0,0.25)",
      },

      /* =========================
         NOTEBOOK LINES
      ========================= */
      backgroundImage: {
        rule:
          "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(51,44,42,0.08) 28px)",
      },

      /* =========================
         ANIMATIONS
      ========================= */
      keyframes: {
        flip: {
          "0%": {
            transform: "rotateY(0deg)",
          },
          "100%": {
            transform: "rotateY(180deg)",
          },
        },

        popIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(6px) scale(0.98)",
          },

          "100%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },

        stampIn: {
          "0%": {
            opacity: 0,
            transform: "scale(1.4) rotate(-8deg)",
          },

          "60%": {
            opacity: 1,
            transform: "scale(0.95) rotate(-8deg)",
          },

          "100%": {
            opacity: 1,
            transform: "scale(1) rotate(-8deg)",
          },
        },
      },

      animation: {
        popIn:
          "popIn 0.25s ease-out both",

        stampIn:
          "stampIn 0.35s cubic-bezier(.2,.8,.3,1.2) both",
      },
    },
  },

  plugins: [],
};