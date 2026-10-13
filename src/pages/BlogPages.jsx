import { Link, useParams } from "react-router-dom";
import EducationLayout from "../components/EducationLayout";
import { SourceCitation, SourceReferences } from "../components/SourceLinks";
import { articles, getArticle } from "../data/articles";
import { getTopic } from "../data/topics";

function BlogIndex() {
  return (
    <EducationLayout>
      <div className="page-intro">
        <span className="eyebrow">Cloakly journal</span>
        <h1 id="page-heading" tabIndex={-1}>Thoughtful guidance for a changing media landscape.</h1>
        <p>Original explainers grounded in primary research and public guidance. Each article shows when its sources and claims were reviewed.</p>
      </div>

      <section className="article-grid" aria-label="Articles">
        {articles.map((article, index) => (
          <article className="article-card" key={article.slug}>
            <div className="topic-card-topline">
              <span>{article.topicLabel}</span>
              <span>0{index + 1}</span>
            </div>
            <h2><Link to={"/blog/" + article.slug}>{article.title}</Link></h2>
            <p>{article.summary}</p>
            <div className="article-card-footer">
              <time dateTime={article.reviewedAt}>Reviewed {article.reviewedAt}</time>
              <Link className="text-link" to={"/blog/" + article.slug}>Read article <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="learning-callout blog-callout">
        <div>
          <span className="eyebrow">Study the foundations</span>
          <h2>Want to learn interactively?</h2>
          <p>Review the three topic lessons and check your understanding at your own pace.</p>
        </div>
        <Link className="button button-primary" to="/learn">Go to Learn <span aria-hidden="true">→</span></Link>
      </section>
    </EducationLayout>
  );
}

function BlockParts({ parts }) {
  return parts.map((part, index) => {
    if (part.type === "cite") return <SourceCitation key={part.sourceId + "-" + index} sourceId={part.sourceId} />;
    if (part.type === "link") return <Link key={part.to + "-" + index} to={part.to}>{part.text}</Link>;
    return <span key={"text-" + index}>{part.text}</span>;
  });
}

function ArticleBlock({ block }) {
  if (block.type === "heading") {
    const Heading = block.level === 3 ? "h3" : "h2";
    return <Heading>{block.text}</Heading>;
  }
  if (block.type === "paragraph") return <p><BlockParts parts={block.parts} /></p>;
  if (block.type === "list") {
    return <ul>{block.items.map((item, index) => <li key={index}><BlockParts parts={item.parts} /></li>)}</ul>;
  }
  return null;
}

function ArticleNotFound() {
  return (
    <EducationLayout>
      <div className="not-found-panel">
        <span className="eyebrow">Article not found</span>
        <h1 id="page-heading" tabIndex={-1}>Choose an article to read.</h1>
        <p>This article link may be out of date. The Blog page has the current reading list.</p>
        <Link className="button button-primary" to="/blog">Back to Blog</Link>
      </div>
    </EducationLayout>
  );
}

function ArticleDetail({ article }) {
  const topic = getTopic(article.topicSlug);
  return (
    <EducationLayout>
      <article className="article-detail">
        <Link className="back-link" to="/blog">← All articles</Link>
        <header className="article-header">
          <span className="eyebrow">{article.topicLabel}</span>
          <h1 id="page-heading" tabIndex={-1}>{article.title}</h1>
          <p className="article-summary">{article.summary}</p>
          <p className="reviewed-date"><time dateTime={article.reviewedAt}>Reviewed {article.reviewedAt}</time></p>
        </header>
        <div className="article-body">
          {article.blocks.map((block, index) => <ArticleBlock block={block} key={article.slug + "-block-" + index} />)}
          <SourceReferences sourceIds={article.sourceIds} />
        </div>
        <aside className="article-related">
          <div>
            <span className="eyebrow">Related lesson</span>
            <h2>{topic?.title}</h2>
            <p>Continue with five study cards and a short quiz.</p>
          </div>
          <Link className="button button-primary" to={"/learn/" + article.topicSlug}>Open lesson <span aria-hidden="true">→</span></Link>
        </aside>
      </article>
    </EducationLayout>
  );
}

function ArticleRoute() {
  const { articleSlug } = useParams();
  const article = getArticle(articleSlug);
  if (!article) return <ArticleNotFound />;
  return <ArticleDetail article={article} />;
}

export { BlogIndex, ArticleRoute };
