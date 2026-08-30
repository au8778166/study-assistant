import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8787;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const BASE_URL =
  process.env.MODEL_BASE_URL ||
  "https://api.groq.com/openai/v1";

const MODEL =
  process.env.MODEL_NAME ||
  "openai/gpt-oss-120b";

const API_KEY =
  process.env.MODEL_API_KEY || "";

const MAX_NOTES_LENGTH = 12000;
const REQUEST_TIMEOUT_MS = 25000;

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(
  express.json({
    limit: "200kb",
  })
);

function systemPromptFor(mode, count) {
  const shared = `
You are a study-material generator embedded in an app.

You do not chat with the user.

You ONLY return a single JSON object.

Do not return:
- surrounding prose
- markdown
- code fences
- explanations outside the JSON
- commentary

If the notes are too thin to produce good material,
do your best with what's given rather than refusing.
`;

  if (mode === "quiz") {
    return `${shared}

Return JSON matching exactly this shape:

{
  "kind": "quiz",
  "title": "short descriptive title for this quiz",
  "questions": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correctIndex": 0,
      "explanation": "one short sentence explaining the correct answer"
    }
  ]
}

Rules:

1. Produce exactly ${count} questions.
2. Each question must have exactly 4 distinct options.
3. correctIndex must be the zero-based index of the correct option.
4. Base every question strictly on the user's notes/topic.
5. Vary which option index is correct.
6. Do not always make the first option correct.
7. Keep questions clear and useful for studying.
8. Keep explanations short.
`;
  }

  return `${shared}

Return JSON matching exactly this shape:

{
  "kind": "flashcards",
  "title": "short descriptive title for this deck",
  "cards": [
    {
      "front": "a term or question",
      "back": "the answer or definition"
    }
  ]
}

Rules:

1. Produce exactly ${count} cards.
2. Keep "front" short.
3. Keep "back" concise, preferably 1-2 sentences.
4. Base every card strictly on the user's notes/topic.
5. Do not create duplicate fronts.
6. Focus on important concepts and definitions.
`;
}

app.post("/api/generate", async (req, res) => {
  const { notes, mode, count } = req.body || {};

  if (typeof notes !== "string" || !notes.trim()) {
    return res.status(400).json({
      error: {
        type: "invalid_request",
        message: "notes is required",
      },
    });
  }

  if (notes.length > MAX_NOTES_LENGTH) {
    return res.status(400).json({
      error: {
        type: "invalid_request",
        message: `notes must be under ${MAX_NOTES_LENGTH} characters`,
      },
    });
  }

  if (mode !== "flashcards" && mode !== "quiz") {
    return res.status(400).json({
      error: {
        type: "invalid_request",
        message: "mode must be flashcards or quiz",
      },
    });
  }

  const safeCount = Math.min(
    Math.max(parseInt(count, 10) || 8, 3),
    20
  );

  if (!API_KEY) {
    return res.status(500).json({
      error: {
        type: "server_config",
        message:
          "MODEL_API_KEY is not set on the server. See README for setup.",
      },
    });
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(
      `${BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.6,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content: systemPromptFor(
                mode,
                safeCount
              ),
            },
            {
              role: "user",
              content: notes.trim(),
            },
          ],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!upstream.ok) {
      const text = await upstream
        .text()
        .catch(() => "");

      return res.status(502).json({
        error: {
          type: "upstream_error",
          message: `Model provider returned ${upstream.status}`,
          detail: text.slice(0, 500),
        },
      });
    }

    const payload = await upstream.json();

    const content =
      payload?.choices?.[0]?.message?.content;

    if (
      !content ||
      typeof content !== "string"
    ) {
      return res.status(502).json({
        error: {
          type: "empty_response",
          message: "Model returned no content",
        },
      });
    }

    return res.status(200).json({
      raw: content,
    });
  } catch (err) {
    clearTimeout(timeout);

    if (err.name === "AbortError") {
      return res.status(504).json({
        error: {
          type: "timeout",
          message: "Model request timed out",
        },
      });
    }

    return res.status(502).json({
      error: {
        type: "network",
        message:
          err.message ||
          "Failed to reach model provider",
      },
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    model: MODEL,
    baseUrl: BASE_URL,
  });
});

app.listen(PORT, () => {
  console.log(
    `Study assistant backend listening on port ${PORT}`
  );

  if (!API_KEY) {
    console.warn(
      "MODEL_API_KEY is not set — /api/generate requests will fail."
    );
  }

 
});