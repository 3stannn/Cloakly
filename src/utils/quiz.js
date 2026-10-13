export function getScore(topic, answers) {
  return topic.questions.reduce(
    (score, question) => score + Number(answers[question.id] === question.correctOptionId),
    0,
  );
}

export function getLocalCompletionDate(date = new Date()) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function generateBadgeSvg(topicTitle, completionDate) {
  const safeTitle = escapeXml(topicTitle);
  const safeDate = escapeXml(completionDate);
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="460" viewBox="0 0 800 460" role="img" aria-labelledby="title description">',
    '<title id="title">Cloakly participation acknowledgement</title>',
    '<desc id="description">Completion acknowledgement only. This is not a certification, endorsement, security assurance, or proof of mastery.</desc>',
    '<rect width="800" height="460" rx="30" fill="#f4f1fb"/>',
    '<rect x="18" y="18" width="764" height="424" rx="24" fill="none" stroke="#7243e8" stroke-width="2"/>',
    '<text x="400" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" letter-spacing="4" fill="#7243e8">CLOAKLY LEARNING</text>',
    '<text x="400" y="175" text-anchor="middle" font-family="Arial, sans-serif" font-size="37" font-weight="700" fill="#181917">Participation acknowledged</text>',
    '<text x="400" y="239" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="#343431">' + safeTitle + '</text>',
    '<text x="400" y="285" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#65655f">Completed ' + safeDate + '</text>',
    '<text x="400" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#65655f">Completion only. No certification, endorsement, or security assurance.</text>',
    '<text x="400" y="373" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#65655f">This does not claim or prove mastery.</text>',
    '</svg>',
  ].join("");
}

export function downloadBadge(topicTitle, completionDate, topicSlug = "learning") {
  const svg = generateBadgeSvg(topicTitle, completionDate);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeSlug = String(topicSlug).replace(/[^a-z0-9-]/gi, "-");
  anchor.href = objectUrl;
  anchor.download = "cloakly-participation-" + safeSlug + ".svg";
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  return objectUrl;
}
