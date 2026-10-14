import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadBadge, generateBadgePdf, getLocalCompletionDate, getScore } from "./quiz.js";

afterEach(() => {
  vi.useRealTimers();
});

describe("quiz utilities", () => {
  it("derives the score from submitted answers and gets the local calendar date", () => {
    const topic = {
      questions: [
        { id: "one", correctOptionId: "yes" },
        { id: "two", correctOptionId: "right" },
      ],
    };

    expect(getScore(topic, { one: "yes", two: "wrong" })).toBe(1);
    expect(getLocalCompletionDate(new Date(2026, 9, 13, 23, 59))).toBe("2026-10-13");
  });

  it("creates a square PDF badge with quiz-specific content", () => {
    const pdf = generateBadgePdf("Responsible sharing & privacy", "2026-10-13");
    const text = new TextDecoder().decode(pdf);

    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text).toContain("/MediaBox [0 0 324 324]");
    expect(text).toContain("RESPONSIBLE SHARING &");
    expect(text).toContain("PRIVACY");
    expect(text).toContain("2026-10-13");
    expect(text).toMatch(/PARTICIPATION ACKNOWLEDGED/i);
    expect(text).toMatch(/COMPLETION ONLY - NO CERTIFICATION/i);
    expect(text).toMatch(/NO ENDORSEMENT OR SECURITY ASSURANCE/i);
    expect(text).not.toMatch(/learner@example\.com|account[-_ ]?id|user[-_ ]?id/i);

    const otherQuizPdf = generateBadgePdf("Deepfake basics", "2026-10-13");
    expect(new TextDecoder().decode(otherQuizPdf)).not.toBe(text);
  });

  it("downloads a quiz-specific PDF Blob, then revokes its object URL", async () => {
    const createObjectURL = vi.fn(() => "blob:cloakly-acknowledgement");
    const revokeObjectURL = vi.fn();
    const priorCreate = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
    const priorRevoke = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    vi.useFakeTimers();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    try {
      const objectUrl = downloadBadge("Adversarial perturbations", "2026-10-13", "adversarial-perturbations");
      const [blob] = createObjectURL.mock.calls[0];
      const anchor = click.mock.contexts[0];

      expect(objectUrl).toBe("blob:cloakly-acknowledgement");
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/pdf");
      expect(anchor.download).toBe("cloakly-participation-adversarial-perturbations.pdf");
      expect(anchor.href).toBe("blob:cloakly-acknowledgement");
      expect(document.body.contains(anchor)).toBe(false);
      expect(click).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1000);
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:cloakly-acknowledgement");
    } finally {
      if (priorCreate) Object.defineProperty(URL, "createObjectURL", priorCreate);
      else delete URL.createObjectURL;
      if (priorRevoke) Object.defineProperty(URL, "revokeObjectURL", priorRevoke);
      else delete URL.revokeObjectURL;
    }
  });
});
