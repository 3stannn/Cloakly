import cloaklyLogoSvg from "../assets/cloakly-logo.svg?raw";

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

const PDF_SIZE = 324;
const PDF_ENCODER = new TextEncoder();

function safePdfText(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function splitBadgeTitle(topicTitle) {
  const words = String(topicTitle).toUpperCase().trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    const candidate = lines.length ? lines.at(-1) + " " + word : word;
    if (!lines.length || candidate.length > 22) lines.push(word);
    else lines[lines.length - 1] = candidate;
  }
  if (lines.length <= 2) return lines;
  return [lines[0], lines.slice(1).join(" ").slice(0, 27)];
}

function approximateTextWidth(text, size) {
  const widths = {
    A: 0.722, B: 0.667, C: 0.722, D: 0.722, E: 0.667, F: 0.611,
    G: 0.778, H: 0.722, I: 0.278, J: 0.556, K: 0.722, L: 0.611,
    M: 0.833, N: 0.722, O: 0.778, P: 0.667, Q: 0.778, R: 0.722,
    S: 0.667, T: 0.611, U: 0.722, V: 0.722, W: 0.944, X: 0.722,
    Y: 0.722, Z: 0.611, "&": 0.722, " ": 0.278, "-": 0.333,
  };
  return [...text].reduce((width, character) => {
    const ratio = widths[character] ?? (/\d/.test(character) ? 0.556 : 0.556);
    return width + size * ratio;
  }, 0);
}

function centeredText(text, y, font, size, color) {
  const safe = safePdfText(text);
  const x = (PDF_SIZE - approximateTextWidth(text, size)) / 2;
  return `${color} rg BT /${font} ${size} Tf ${x.toFixed(2)} ${y} Td (${safe}) Tj ET`;
}

function circlePath(cx, cy, radius) {
  const k = radius * 0.5522847498;
  return [
    `${(cx + radius).toFixed(2)} ${cy} m`,
    `${(cx + radius).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx + k).toFixed(2)} ${(cy + radius).toFixed(2)} ${cx} ${(cy + radius).toFixed(2)} c`,
    `${(cx - k).toFixed(2)} ${(cy + radius).toFixed(2)} ${(cx - radius).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx - radius).toFixed(2)} ${cy} c`,
    `${(cx - radius).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx - k).toFixed(2)} ${(cy - radius).toFixed(2)} ${cx} ${(cy - radius).toFixed(2)} c`,
    `${(cx + k).toFixed(2)} ${(cy - radius).toFixed(2)} ${(cx + radius).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx + radius).toFixed(2)} ${cy} c`,
    "h",
  ].join("\n");
}

function svgPathToPdf(pathData, { scale, offsetX, offsetY, markTransform = false }) {
  const tokens = pathData.match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:[eE][-+]?\d+)?/g) ?? [];
  const output = [];
  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let previousControl = null;

  const transform = (x, y) => {
    const transformedX = markTransform ? x + 4 + Math.tan((-8 * Math.PI) / 180) * y : x;
    const transformedY = markTransform ? y + 8 : y;
    return [offsetX + transformedX * scale, offsetY + (40 - transformedY) * scale];
  };
  const number = () => Number(tokens[index++]);
  const isCommand = (token) => /^[a-zA-Z]$/.test(token ?? "");

  while (index < tokens.length) {
    if (isCommand(tokens[index])) command = tokens[index++];
    const lower = command.toLowerCase();
    const relative = command === lower;

    if (lower === "z") {
      output.push("h");
      currentX = startX;
      currentY = startY;
      previousControl = null;
      command = "";
      continue;
    }

    if (lower === "m" || lower === "l") {
      const x = number();
      const y = number();
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      const [pdfX, pdfY] = transform(currentX, currentY);
      output.push(`${pdfX.toFixed(2)} ${pdfY.toFixed(2)} ${lower === "m" ? "m" : "l"}`);
      if (lower === "m") {
        startX = currentX;
        startY = currentY;
        command = relative ? "l" : "L";
      }
      previousControl = null;
      continue;
    }

    if (lower === "h") {
      const x = number();
      currentX = relative ? currentX + x : x;
      const [pdfX, pdfY] = transform(currentX, currentY);
      output.push(`${pdfX.toFixed(2)} ${pdfY.toFixed(2)} l`);
      previousControl = null;
      continue;
    }

    if (lower === "v") {
      const y = number();
      currentY = relative ? currentY + y : y;
      const [pdfX, pdfY] = transform(currentX, currentY);
      output.push(`${pdfX.toFixed(2)} ${pdfY.toFixed(2)} l`);
      previousControl = null;
      continue;
    }

    if (lower === "c") {
      const values = [number(), number(), number(), number(), number(), number()];
      const x1 = relative ? currentX + values[0] : values[0];
      const y1 = relative ? currentY + values[1] : values[1];
      const x2 = relative ? currentX + values[2] : values[2];
      const y2 = relative ? currentY + values[3] : values[3];
      const x = relative ? currentX + values[4] : values[4];
      const y = relative ? currentY + values[5] : values[5];
      const p1 = transform(x1, y1);
      const p2 = transform(x2, y2);
      const end = transform(x, y);
      output.push(`${p1[0].toFixed(2)} ${p1[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)} c`);
      currentX = x;
      currentY = y;
      previousControl = [x2, y2];
      continue;
    }

    if (lower === "s") {
      const values = [number(), number(), number(), number()];
      const x1 = previousControl ? currentX * 2 - previousControl[0] : currentX;
      const y1 = previousControl ? currentY * 2 - previousControl[1] : currentY;
      const x2 = relative ? currentX + values[0] : values[0];
      const y2 = relative ? currentY + values[1] : values[1];
      const x = relative ? currentX + values[2] : values[2];
      const y = relative ? currentY + values[3] : values[3];
      const p1 = transform(x1, y1);
      const p2 = transform(x2, y2);
      const end = transform(x, y);
      output.push(`${p1[0].toFixed(2)} ${p1[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)} c`);
      currentX = x;
      currentY = y;
      previousControl = [x2, y2];
      continue;
    }

    throw new Error(`Unsupported Cloakly logo SVG command: ${command}`);
  }

  return output.join("\n");
}

function logoPdfCommands() {
  const scale = 0.8;
  const offsetX = (PDF_SIZE - 160 * scale) / 2;
  const offsetY = 230;
  const paths = [...cloaklyLogoSvg.matchAll(/<path\b([^>]*)\bd="([^"]+)"[^>]*>/g)];
  if (paths.length < 3) throw new Error("The Cloakly logo SVG does not contain the expected paths.");

  return paths.map((match) => {
    const isMark = /class="st0"/.test(match[1]);
    const path = svgPathToPdf(match[2], { scale, offsetX, offsetY, markTransform: isMark });
    if (isMark) return `0.090 0.094 0.090 RG ${(2.5 * scale).toFixed(2)} w 1 J 1 j\n${path}\nS`;
    return `0.090 0.094 0.090 rg\n${path}\nf`;
  });
}

function buildPdf(objects) {
  const header = "%PDF-1.4\n%Cloakly\n";
  let body = header;
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(PDF_ENCODER.encode(body).length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = PDF_ENCODER.encode(body).length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  body += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return PDF_ENCODER.encode(body);
}

export function generateBadgePdf(topicTitle, completionDate) {
  const titleLines = splitBadgeTitle(topicTitle);
  const baseTitleSize = titleLines.length === 1 ? 25 : 21;
  const longestTitleWidth = Math.max(...titleLines.map((line) => approximateTextWidth(line, 1)));
  const titleSize = Math.min(baseTitleSize, 238 / longestTitleWidth);
  const titleY = titleLines.length === 1 ? [164] : [178, 151];
  const titleCommands = titleLines.map((line, index) => centeredText(line, titleY[index], "F2", titleSize, "0.094 0.098 0.090"));
  const dateLabel = String(completionDate);
  const content = [
    "0.980 0.980 0.973 rg 0 0 324 324 re f",
    "0.216 0.420 0.286 rg",
    circlePath(162, 162, 153),
    "f",
    "0.980 0.980 0.973 rg",
    circlePath(162, 162, 146),
    "f",
    "0.290 0.518 0.369 RG 1.3 w",
    circlePath(162, 162, 137),
    "S",
    ...logoPdfCommands(),
    centeredText("PARTICIPATION BADGE", 216, "F2", 7, "0.216 0.420 0.286"),
    ...titleCommands,
    "0.290 0.518 0.369 RG 2 w 108 135 m 216 135 l S",
    centeredText("PARTICIPATION ACKNOWLEDGED", 113, "F2", 8, "0.404 0.408 0.384"),
    "0.902 0.941 0.914 rg 110 79 104 24 re f",
    centeredText(dateLabel, 87, "F2", 8, "0.216 0.420 0.286"),
    centeredText("COMPLETION ONLY - NO CERTIFICATION", 65, "F1", 5.4, "0.404 0.408 0.384"),
    centeredText("NO ENDORSEMENT OR SECURITY ASSURANCE", 56, "F1", 5.2, "0.404 0.408 0.384"),
  ].join("\n");
  const contentLength = PDF_ENCODER.encode(content).length;
  const documentTitle = safePdfText(`Cloakly ${topicTitle} participation badge`);

  return buildPdf([
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_SIZE} ${PDF_SIZE}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`,
    `<< /Title (${documentTitle}) /Author (Cloakly Learning) /Subject (Quiz participation badge) >>`,
  ]);
}

export function downloadBadge(topicTitle, completionDate, topicSlug = "learning") {
  const pdf = generateBadgePdf(topicTitle, completionDate);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeSlug = String(topicSlug).replace(/[^a-z0-9-]/gi, "-");
  anchor.href = objectUrl;
  anchor.download = "cloakly-participation-" + safeSlug + ".pdf";
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  return objectUrl;
}
