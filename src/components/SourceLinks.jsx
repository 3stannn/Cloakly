import { getSources } from "../data/sources";
import { Link } from "react-router-dom";

function sourceLabel(source) {
  if (source.id === "nistSyntheticContent") return "NIST (2024)";
  if (source.id === "photoGuard") return "PhotoGuard (2023)";
  if (source.publisher.startsWith("eSafety Commissioner")) return "eSafety Commissioner";
  if (source.publisher === "U.S. Copyright Office") return "U.S. Copyright Office";
  return source.publisher;
}

export function SourceCitation({ sourceId }) {
  const source = getSources([sourceId])[0];
  if (!source) return null;
  if (source.internal) {
    return <Link className="citation-link" to={source.url}>{source.title} (first-party)</Link>;
  }

  return (
    <a
      className="citation-link"
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={source.title}
    >
      {sourceLabel(source)} <span aria-hidden="true">↗</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

export function SourceLinks({ sourceIds = [] }) {
  const uniqueSources = [...new Map(getSources(sourceIds).map((source) => [source.id, source])).values()];
  if (uniqueSources.length === 0) return null;

  return (
    <div className="source-links" aria-label="Sources for this explanation">
      <span className="source-links-label">Sources</span>
      {uniqueSources.map((source) => (
        <SourceCitation key={source.id} sourceId={source.id} />
      ))}
    </div>
  );
}

export function SourceReferences({ sourceIds = [] }) {
  const uniqueSources = [...new Map(getSources(sourceIds).map((source) => [source.id, source])).values()];
  return (
    <section className="reference-list" aria-label="References">
      <p className="external-note">Source links open in a new tab.</p>
      <ul>
        {uniqueSources.map((source) => (
          <li key={source.id}>
            <div>
              <strong>{source.title}</strong>
              {source.authors && <span>{source.authors}</span>}
              <span>{source.publisher} · {source.published}</span>
            </div>
            {source.internal ? <Link to={source.url}>About this Cloakly demo (first-party)</Link> : <a href={source.url} target="_blank" rel="noreferrer">
              Open primary source <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>}
          </li>
        ))}
      </ul>
    </section>
  );
}
