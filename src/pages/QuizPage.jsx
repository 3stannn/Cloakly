import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EducationLayout from "../components/EducationLayout";
import { SourceLinks } from "../components/SourceLinks";
import { getTopic } from "../data/topics";
import { downloadBadge, getLocalCompletionDate, getScore } from "../utils/quiz";

function QuizNotFound() {
  return (
    <EducationLayout>
      <div className="not-found-panel">
        <span className="eyebrow">Quiz not found</span>
        <h1 id="page-heading" tabIndex={-1}>Choose a learning topic.</h1>
        <p>This quiz link may be out of date. Start from Learn to open a current lesson and its quiz.</p>
        <Link className="button button-primary" to="/learn">Back to Learn</Link>
      </div>
    </EducationLayout>
  );
}

function QuizAttempt({ topic }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [completedOn, setCompletedOn] = useState("");
  const pendingFocus = useRef("");
  const firstOptionRef = useRef(null);
  const resultsHeadingRef = useRef(null);
  const questionCount = topic.questions.length;
  const answeredCount = topic.questions.reduce((count, question) => count + Number(Boolean(answers[question.id])), 0);
  const allAnswered = answeredCount === questionCount;
  const score = useMemo(() => getScore(topic, answers), [topic, answers]);

  useEffect(() => {
    if (pendingFocus.current === "results") resultsHeadingRef.current?.focus();
    if (pendingFocus.current === "question") firstOptionRef.current?.focus();
    pendingFocus.current = "";
  }, [submitted]);

  function submitQuiz(event) {
    event.preventDefault();
    if (!allAnswered) return;
    pendingFocus.current = "results";
    setSubmitted(true);
    setCompletedOn(getLocalCompletionDate());
  }

  function retryQuiz() {
    pendingFocus.current = "question";
    setAnswers({});
    setSubmitted(false);
    setCompletedOn("");
  }

  return (
    <EducationLayout>
      <div className="quiz-heading-row">
        <div>
          <Link className="back-link" to={"/learn/" + topic.slug}>← Back to lesson</Link>
          <span className="eyebrow">Topic quiz</span>
          <h1 id="page-heading" tabIndex={-1}>{topic.title}</h1>
          <p>Choose one answer for each question. Submit when all five are complete.</p>
        </div>
        <div className="quiz-progress" aria-live="polite">
          <strong>{answeredCount} of {questionCount}</strong>
          <span>questions answered</span>
          <progress value={answeredCount} max={questionCount} aria-label="Quiz questions answered" />
        </div>
      </div>

      {!submitted ? (
        <form className="quiz-form" onSubmit={submitQuiz}>
          {topic.questions.map((question, questionIndex) => (
            <fieldset className="quiz-question" key={question.id}>
              <legend>
                <span className="question-count">Question {questionIndex + 1} of {questionCount}</span>
                <span>{question.prompt}</span>
              </legend>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => (
                  <label className="quiz-option" key={option.id}>
                    <input
                      type="radio"
                      ref={questionIndex === 0 && optionIndex === 0 ? firstOptionRef : null}
                      name={topic.slug + "-" + question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: option.id }))}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="quiz-submit-row">
            <p aria-live="polite">{allAnswered ? "All questions answered. You can submit your quiz." : "Answer every question to submit."}</p>
            <button className="button button-primary" type="submit" disabled={!allAnswered}>Submit quiz</button>
          </div>
        </form>
      ) : (
        <section className="quiz-results" aria-live="polite" aria-labelledby="results-heading">
          <div className="result-summary">
            <span className="eyebrow">Quiz complete</span>
            <h2 id="results-heading" tabIndex={-1} ref={resultsHeadingRef}>You scored {score} of {questionCount}.</h2>
            <p>Your answers and score are held in memory for this page only.</p>
            <div className="participation-note">
              <strong>Participation acknowledged</strong>
              <p>This acknowledges completion only. It is not a certification, endorsement, security assurance, or proof of mastery.</p>
            </div>
            <div className="result-actions">
              <button className="button button-primary" type="button" onClick={() => downloadBadge(topic.title, completedOn, topic.slug)}>Download PDF badge</button>
              <button className="button button-outline" type="button" onClick={retryQuiz}>Retry quiz</button>
              <Link className="text-link" to={"/learn/" + topic.slug}>Review lesson</Link>
            </div>
          </div>

          <div className="answer-review">
            <h3>Answer review</h3>
            {topic.questions.map((question, questionIndex) => {
              const selected = question.options.find((option) => option.id === answers[question.id]);
              const correct = question.options.find((option) => option.id === question.correctOptionId);
              const isCorrect = selected?.id === correct.id;
              return (
                <article className="answer-review-item" key={question.id}>
                  <span className="question-count">Question {questionIndex + 1} · {isCorrect ? "Correct" : "Review"}</span>
                  <h4>{question.prompt}</h4>
                  <p><strong>Your answer:</strong> {selected?.text}</p>
                  <p><strong>Correct answer:</strong> {correct.text}</p>
                  <p>{isCorrect ? question.explanation : question.feedbackByOptionId[selected.id]}</p>
                  {!isCorrect && <p className="correct-explanation"><strong>Why the correct answer fits:</strong> {question.explanation}</p>}
                  <SourceLinks sourceIds={question.sourceIds} />
                </article>
              );
            })}
          </div>
        </section>
      )}
    </EducationLayout>
  );
}

function QuizPage() {
  const { topicSlug } = useParams();
  const topic = getTopic(topicSlug);
  if (!topic) return <QuizNotFound />;
  return <QuizAttempt key={topic.slug} topic={topic} />;
}

export default QuizPage;
