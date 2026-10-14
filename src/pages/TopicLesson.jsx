import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EducationLayout from "../components/EducationLayout";
import { SourceLinks } from "../components/SourceLinks";
import { getTopic } from "../data/topics";

function LessonNotFound() {
  return (
    <EducationLayout>
      <div className="not-found-panel">
        <span className="eyebrow">Lesson not found</span>
        <h1 id="page-heading" tabIndex={-1}>Choose a learning topic.</h1>
        <p>This lesson link may be out of date. The Learn page has the current topic list.</p>
        <Link className="button button-primary" to="/learn">Back to Learn</Link>
      </div>
    </EducationLayout>
  );
}

function LessonContent({ topic }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = topic.cards[cardIndex];

  function moveCard(nextIndex) {
    setCardIndex(nextIndex);
    setRevealed(false);
  }

  return (
    <EducationLayout>
      <div className="lesson-heading-row">
        <div className="lesson-heading-copy">
          <Link className="back-link" to="/learn">← All topics</Link>
          <span className="eyebrow">Topic {topic.number} · Learn</span>
          <h1 id="page-heading" tabIndex={-1}>{topic.title}</h1>
          <p>{topic.summary}</p>
        </div>
        <div className="lesson-actions">
          <Link className="button button-primary" to={"/learn/" + topic.slug + "/quiz"}>Take the quiz <span aria-hidden="true">→</span></Link>
          {topic.demoLink && <Link className="text-link" to="/#simulation">See the Cloakly simulation</Link>}
        </div>
      </div>

      {/* <aside className="takeaway-panel">
        <span className="eyebrow">Key takeaway</span>
        <p>{topic.takeaway}</p>
      </aside> */}

      <section className="flashcard-section" aria-labelledby="flashcard-heading">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">Study cards</span>
            <h2 id="flashcard-heading">Read, reveal, remember.</h2>
          </div>
          <p>Use the controls to move through the lesson. Each card explains one idea and links to its source.</p>
        </div>

        <article className="flashcard" aria-label={"Card " + (cardIndex + 1) + " of " + topic.cards.length}>
          <div className="flashcard-topline">
            <span>LESSON CARD</span>
            <span aria-live="polite">Card {cardIndex + 1} of {topic.cards.length}</span>
          </div>
          <h3>{card.front}</h3>
          {revealed ? (
            <div className="flashcard-answer">
              <span className="eyebrow">Explanation</span>
              <p>{card.back}</p>
              <SourceLinks sourceIds={card.sourceIds} />
            </div>
          ) : (
            <p className="flashcard-prompt">Think through the question, then reveal the explanation.</p>
          )}
          <div className="flashcard-actions">
            <button className="button button-primary" type="button" onClick={() => setRevealed((shown) => !shown)} aria-pressed={revealed}>
              {revealed ? "Hide answer" : "Reveal answer"}
            </button>
            <span className="visually-hidden" aria-live="polite">{revealed ? "Answer shown" : "Question shown"}</span>
            <div className="card-navigation">
              <button className="button button-outline" type="button" onClick={() => moveCard(cardIndex - 1)} disabled={cardIndex === 0} aria-label="Previous card">← Previous</button>
              <button className="button button-outline" type="button" onClick={() => moveCard(cardIndex + 1)} disabled={cardIndex === topic.cards.length - 1} aria-label="Next card">Next →</button>
            </div>
          </div>
        </article>
      </section>

      <section className="lesson-bottom-row">
        <div>
          <span className="eyebrow">Check your understanding</span>
          <h2>Ready for the five-question quiz?</h2>
          <p>You can retry whenever you like. Your answers stay only in this page while you take the quiz.</p>
          <Link className="button button-primary" to={"/learn/" + topic.slug + "/quiz"}>Start quiz <span aria-hidden="true">→</span></Link>
        </div>
        {topic.articleSlugs?.length > 0 && (
          <div className="related-reading">
            <span className="eyebrow">Related reading</span>
            {topic.articleSlugs.map((slug) => (
              <Link className="text-link" key={slug} to={"/blog/" + slug}>{slug === "share-with-care" ? "A practical guide to sharing with care" : slug === "check-context-before-you-share" ? "A careful way to check suspicious media" : slug === "responding-to-impersonation" ? "Responding when someone impersonates you" : "What perturbation research can—and cannot—show"} <span aria-hidden="true">→</span></Link>
            ))}
          </div>
        )}
      </section>
    </EducationLayout>
  );
}

function TopicLesson() {
  const { topicSlug } = useParams();
  const topic = getTopic(topicSlug);
  if (!topic) return <LessonNotFound />;
  return <LessonContent key={topic.slug} topic={topic} />;
}

export default TopicLesson;
