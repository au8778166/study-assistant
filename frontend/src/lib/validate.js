// The model is asked for JSON, but "asked for" is not "guaranteed to get".
// Every field here is checked before it ever reaches a React component, and
// every failure gets a specific, human-readable reason instead of a crash.

export class ShapeError extends Error {
  constructor(message) {
    super(message);
    this.name = "ShapeError";
  }
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/** Extract a JSON object from a string that may contain stray prose or
 * markdown code fences around it (small local models especially like to
 * add these even when told not to). Throws ShapeError if none is found. */
export function extractJson(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new ShapeError("The model returned an empty response.");
  }

  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new ShapeError("The model's response didn't contain a JSON object.");
  }
  text = text.slice(start, end + 1);

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new ShapeError("The model's JSON was malformed and couldn't be parsed.");
  }
}

export function validateFlashcards(data) {
  if (!data || typeof data !== "object") throw new ShapeError("Expected an object.");
  if (!isNonEmptyString(data.title)) throw new ShapeError("Missing a deck title.");
  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    throw new ShapeError("Expected a non-empty list of cards.");
  }

  const cards = data.cards.map((c, i) => {
    if (!c || typeof c !== "object") throw new ShapeError(`Card ${i + 1} is not an object.`);
    if (!isNonEmptyString(c.front)) throw new ShapeError(`Card ${i + 1} is missing "front".`);
    if (!isNonEmptyString(c.back)) throw new ShapeError(`Card ${i + 1} is missing "back".`);
    return { id: `c${i}`, front: c.front.trim(), back: c.back.trim() };
  });

  return { kind: "flashcards", title: data.title.trim(), cards };
}

export function validateQuiz(data) {
  if (!data || typeof data !== "object") throw new ShapeError("Expected an object.");
  if (!isNonEmptyString(data.title)) throw new ShapeError("Missing a quiz title.");
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new ShapeError("Expected a non-empty list of questions.");
  }

  const questions = data.questions.map((q, i) => {
    if (!q || typeof q !== "object") throw new ShapeError(`Question ${i + 1} is not an object.`);
    if (!isNonEmptyString(q.question)) throw new ShapeError(`Question ${i + 1} is missing "question".`);
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new ShapeError(`Question ${i + 1} needs at least 2 options.`);
    }
    const options = q.options.map((o, j) => {
      if (!isNonEmptyString(o)) throw new ShapeError(`Question ${i + 1}, option ${j + 1} is empty.`);
      return String(o).trim();
    });
    const correctIndex = Number(q.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw new ShapeError(`Question ${i + 1} has an out-of-range correctIndex.`);
    }
    return {
      id: `q${i}`,
      question: q.question.trim(),
      options,
      correctIndex,
      explanation: isNonEmptyString(q.explanation) ? q.explanation.trim() : "",
    };
  });

  return { kind: "quiz", title: data.title.trim(), questions };
}

export function validateStudySet(raw, expectedMode) {
  const data = extractJson(raw);
  if (expectedMode === "quiz") return validateQuiz(data);
  return validateFlashcards(data);
}
