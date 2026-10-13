import { Link } from "react-router-dom";
import EducationLayout from "../components/EducationLayout";
import { topics } from "../data/topics";

function LearnIndex() {
  return (
    <EducationLayout>
      <div className="page-intro">
        <span className="eyebrow">Cloakly learning hub</span>
        <h1 id="page-heading" tabIndex={-1}>Learn at your own pace.</h1>
        <p>Build context before you share, check, or respond to synthetic and manipulated media. Each short lesson includes five study cards and a five-question quiz.</p>
      </div>

      <section className="topic-grid" aria-label="Learning topics">
        {topics.map((topic) => (
          <article className="topic-card" key={topic.slug}>
            <div className="topic-card-topline">
              <span>{topic.number} / TOPIC</span>
              <span>5 cards · 5 questions</span>
            </div>
            <h2>{topic.title}</h2>
            <p>{topic.summary}</p>
            <p className="topic-takeaway"><strong>Key idea</strong>{topic.takeaway}</p>
            <Link className="text-link" to={"/learn/" + topic.slug}>
              Start lesson <span aria-hidden="true">→</span>
              <span className="visually-hidden">: {topic.title}</span>
            </Link>
          </article>
        ))}
      </section>

      <section className="learning-callout">
        <div>
          <span className="eyebrow">Keep exploring</span>
          <h2>Guidance for real decisions.</h2>
          <p>Read sourced explainers on sharing responsibly, checking suspicious media, and understanding the limits of perturbation research.</p>
        </div>
        <Link className="button button-primary" to="/blog">Explore the blog <span aria-hidden="true">→</span></Link>
      </section>
    </EducationLayout>
  );
}

export default LearnIndex;
