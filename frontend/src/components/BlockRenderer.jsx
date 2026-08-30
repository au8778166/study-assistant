import FlashcardDeck from "./flashcards/FlashcardDeck.jsx";
import QuizView from "./quiz/QuizView.jsx";
import ChecklistBlock from "./ChecklistBlock.jsx";
import ChartBlock from "./ChartBlock.jsx";

export default function BlockRenderer({ block }) {
  switch (block.type) {
    case "flashcards":
      return (
        <FlashcardDeck
          studySet={{
            kind: "flashcards",
            title: block.title,
            cards: block.cards,
          }}
        />
      );

    case "quiz":
      return (
        <QuizView
          studySet={{
            kind: "quiz",
            title: block.title,
            questions: block.questions,
          }}
        />
      );

    case "checklist":
      return <ChecklistBlock block={block} />;

    case "chart":
      return <ChartBlock block={block} />;

    default:
      return null;
  }
}