import { describe, expect, it } from "vitest";
import { validateContentData } from "./contentIntegrity.js";
import { getArticle } from "./articles.js";
import { getTopic } from "./topics.js";

describe("learning content records", () => {
  it("validates source IDs, topic/article cross references, and required lesson content", () => {
    expect(validateContentData()).toBe(true);
  });

  it("does not resolve unknown topic or article slugs to existing content", () => {
    expect(getTopic("unknown-topic")).toBeUndefined();
    expect(getArticle("unknown-article")).toBeUndefined();
  });
});
