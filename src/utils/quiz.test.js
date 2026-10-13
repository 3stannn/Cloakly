import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadBadge, generateBadgeSvg, getLocalCompletionDate, getScore } from "./quiz.js";

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

  it("creates well-formed SVG and escapes topic and date text", () => {
    const svg = generateBadgeSvg('<script>& "topic"\'s</script>', "2026-10-13&later");
    const parsed = new DOMParser().parseFromString(svg, "image/svg+xml");

    expect(parsed.querySelector("parsererror")).toBeNull();
    expect(parsed.documentElement.localName).toBe("svg");
    expect(parsed.querySelector("script")).toBeNull();
    expect(svg).toContain("&lt;script&gt;&amp; &quot;topic&quot;&apos;s&lt;/script&gt;");
    expect(svg).toContain("2026-10-13&amp;later");
    expect(svg).toMatch(/participation acknowledged/i);
    expect(svg).toMatch(/completion only/i);
    expect(svg).toMatch(/not a certification/i);
    expect(svg).toMatch(/security assurance/i);
    expect(svg).toMatch(/proof of mastery/i);
    expect(svg).not.toMatch(/learner@example\.com|account[-_ ]?id|user[-_ ]?id/i);
  });

  it("downloads an SVG Blob, starts the anchor download, then revokes its object URL", async () => {
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
      expect(blob.type).toBe("image/svg+xml;charset=utf-8");
      expect(anchor.download).toBe("cloakly-participation-adversarial-perturbations.svg");
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
