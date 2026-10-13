import { articles } from "./articles.js";
import { getTopic, topics } from "./topics.js";
import { sources } from "./sources.js";

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) {
    throw new Error("Duplicate " + label + " in learning content.");
  }
}

function assertSources(sourceIds, context) {
  for (const sourceId of sourceIds ?? []) {
    if (!sources[sourceId]) {
      throw new Error("Unknown source ID " + sourceId + " in " + context + ".");
    }
  }
}

function collectBlockSourceIds(blocks = []) {
  const ids = [];
  for (const block of blocks) {
    if (block.sourceId) ids.push(block.sourceId);
    for (const part of block.parts ?? []) {
      if (part.sourceId) ids.push(part.sourceId);
    }
    for (const item of block.items ?? []) {
      for (const part of item.parts ?? []) {
        if (part.sourceId) ids.push(part.sourceId);
      }
    }
  }
  return ids;
}

export function validateContentData() {
  if (topics.length !== 3) {
    throw new Error("The learning area must define exactly three initial topics.");
  }
  if (articles.length < 3) {
    throw new Error("The blog must define at least three articles.");
  }

  assertUnique(topics.map((topic) => topic.slug), "topic slugs");
  assertUnique(articles.map((article) => article.slug), "article slugs");

  for (const topic of topics) {
    if (!topic.slug || !topic.title || topic.cards.length !== 5 || topic.questions.length !== 5) {
      throw new Error("Topic " + topic.slug + " must have a title, five cards, and five questions.");
    }
    assertUnique(topic.cards.map((card) => card.id), topic.slug + " card IDs");
    assertUnique(topic.questions.map((question) => question.id), topic.slug + " question IDs");
    assertSources(topic.cards.flatMap((card) => card.sourceIds ?? []), topic.slug + " cards");
    assertSources(topic.questions.flatMap((question) => question.sourceIds ?? []), topic.slug + " questions");

    for (const question of topic.questions) {
      const optionIds = question.options.map((option) => option.id);
      assertUnique(optionIds, topic.slug + " option IDs");
      if (!optionIds.includes(question.correctOptionId)) {
        throw new Error("Question " + question.id + " has no matching correct option.");
      }
      for (const optionId of optionIds) {
        if (optionId !== question.correctOptionId && !question.feedbackByOptionId?.[optionId]) {
          throw new Error("Question " + question.id + " is missing feedback for " + optionId + ".");
        }
      }
    }

    for (const articleSlug of topic.articleSlugs ?? []) {
      if (!articles.some((article) => article.slug === articleSlug && article.topicSlug === topic.slug)) {
        throw new Error("Topic " + topic.slug + " references an unrelated or missing article " + articleSlug + ".");
      }
    }
  }

  for (const article of articles) {
    if (!getTopic(article.topicSlug)) {
      throw new Error("Article " + article.slug + " references an unknown topic.");
    }
    assertSources(article.sourceIds, "article " + article.slug + " references");
    const citedIds = [...new Set(collectBlockSourceIds(article.blocks))];
    assertSources(citedIds, "article " + article.slug + " blocks");
    for (const sourceId of citedIds) {
      if (!article.sourceIds.includes(sourceId)) {
        throw new Error("Article " + article.slug + " cites " + sourceId + " without listing it in references.");
      }
    }
  }

  for (const [key, source] of Object.entries(sources)) {
    const validUrl = source.internal ? source.url === "/#simulation" : source.url.startsWith("https://");
    if (source.id !== key || !source.title || !source.publisher || !validUrl) {
      throw new Error("Invalid source record " + key + ".");
    }
  }

  return true;
}
