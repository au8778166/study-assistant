import { validateStudySet, ShapeError } from "./validate.js";

export class ApiError extends Error {
  constructor(type, message) {
    super(message);
    this.name = "ApiError";
    this.type = type;
  }
}

const CLIENT_TIMEOUT_MS = 30000;

export async function generateStudySet({
  notes,
  mode,
  count,
  signal,
}) {
  const timeoutController = new AbortController();

  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, CLIENT_TIMEOUT_MS);

  const onExternalAbort = () => {
    timeoutController.abort();
  };

  if (signal) {
    signal.addEventListener("abort", onExternalAbort);
  }

  let res;

  try {
    res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes,
        mode,
        count,
      }),
      signal: timeoutController.signal,
    });
  } catch (err) {
    if (signal?.aborted) {
      throw new ApiError(
        "cancelled",
        "Request was cancelled."
      );
    }

    if (err.name === "AbortError") {
      throw new ApiError(
        "timeout",
        "The request took too long and timed out."
      );
    }

    throw new ApiError(
      "network",
      "Couldn't reach the server. Check your connection and make sure the backend is running."
    );
  } finally {
    clearTimeout(timeoutId);

    if (signal) {
      signal.removeEventListener(
        "abort",
        onExternalAbort
      );
    }
  }

  if (signal?.aborted) {
    throw new ApiError(
      "cancelled",
      "Request was cancelled."
    );
  }

  let body;

  try {
    body = await res.json();
  } catch {
    throw new ApiError(
      "server",
      "The server returned invalid JSON."
    );
  }

  if (!res.ok) {
    const info = body?.error || {};

    const type =
      info.type === "timeout"
        ? "timeout"
        : "server";

    throw new ApiError(
      type,
      info.message ||
        `Server responded with ${res.status}.`
    );
  }

  try {
    return validateStudySet(body.raw, mode);
  } catch (err) {
    if (err instanceof ShapeError) {
      throw new ApiError(
        "shape",
        err.message
      );
    }

    throw new ApiError(
      "shape",
      "The model's response didn't match the expected format."
    );
  }
}