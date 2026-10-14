import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import QuizPage from "./QuizPage.jsx";
import { getTopic } from "../data/topics.js";

function QuizTestRoutes({ initialPath = "/learn/deepfake-basics/quiz" }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/learn/:topicSlug/quiz"
          element={(
            <>
              <nav aria-label="Test navigation">
                <Link to="/learn">Leave quiz</Link>
                <Link to="/learn/responsible-sharing/quiz">Open responsible sharing quiz</Link>
              </nav>
              <QuizPage />
            </>
          )}
        />
        <Route
          path="/learn"
          element={(
            <main>
              <p>Learn index</p>
              <Link to="/learn/deepfake-basics/quiz">Return to basics quiz</Link>
            </main>
          )}
        />
      </Routes>
    </MemoryRouter>
  );
}

async function answerAll(user, topic, chooseOption) {
  const groups = screen.getAllByRole("group");
  for (const [index, question] of topic.questions.entries()) {
    const option = chooseOption(question);
    await user.click(within(groups[index]).getByRole("radio", { name: option.text }));
  }
}

describe("quiz attempt flow", () => {
  it("blocks submission when no answers or only partial answers are selected", async () => {
    const user = userEvent.setup();
    const topic = getTopic("deepfake-basics");
    render(<QuizTestRoutes />);

    const submit = screen.getByRole("button", { name: "Submit quiz" });
    expect(submit.disabled).toBe(true);
    expect(screen.getByText("0 of 5")).toBeTruthy();

    const firstOption = topic.questions[0].options[0];
    await user.click(screen.getByRole("radio", { name: firstOption.text }));

    expect(screen.getByText("1 of 5")).toBeTruthy();
    expect(submit.disabled).toBe(true);
    expect(screen.queryByText("Participation acknowledged")).toBeNull();
  });

  it("shows a full score, explanations, and the participation acknowledgement after five correct answers", async () => {
    const user = userEvent.setup();
    const topic = getTopic("deepfake-basics");
    render(<QuizTestRoutes />);

    await answerAll(user, topic, (question) => question.options.find((option) => option.id === question.correctOptionId));
    expect(screen.getByRole("button", { name: "Submit quiz" }).disabled).toBe(false);
    await user.click(screen.getByRole("button", { name: "Submit quiz" }));

    expect(screen.getByRole("heading", { name: "You scored 5 of 5." })).toBeTruthy();
    expect(screen.getByText(/This acknowledges completion only/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download PDF badge" })).toBeTruthy();
    for (const question of topic.questions) {
      expect(screen.getByText(question.explanation)).toBeTruthy();
    }
  });

  it("awards completion and a 0/5 result when every answer is wrong", async () => {
    const user = userEvent.setup();
    const topic = getTopic("deepfake-basics");
    render(<QuizTestRoutes />);

    await answerAll(user, topic, (question) => question.options.find((option) => option.id !== question.correctOptionId));
    await user.click(screen.getByRole("button", { name: "Submit quiz" }));

    expect(screen.getByRole("heading", { name: "You scored 0 of 5." })).toBeTruthy();
    expect(screen.getByText(/This acknowledges completion only/)).toBeTruthy();
    for (const question of topic.questions) {
      expect(screen.getByText(question.feedbackByOptionId[question.options.find((option) => option.id !== question.correctOptionId).id])).toBeTruthy();
    }
  });

  it("retry clears answers, completion, and the score", async () => {
    const user = userEvent.setup();
    const topic = getTopic("deepfake-basics");
    render(<QuizTestRoutes />);

    await answerAll(user, topic, (question) => question.options.find((option) => option.id === question.correctOptionId));
    await user.click(screen.getByRole("button", { name: "Submit quiz" }));
    await user.click(screen.getByRole("button", { name: "Retry quiz" }));

    expect(screen.getByText("0 of 5")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit quiz" }).disabled).toBe(true);
    expect(screen.queryByText("Participation acknowledged")).toBeNull();
    expect(screen.queryByRole("heading", { name: "You scored 5 of 5." })).toBeNull();
    expect(screen.getAllByRole("radio").every((radio) => !radio.checked)).toBe(true);
  });

  it("starts a blank attempt after switching topics or leaving and returning", async () => {
    const user = userEvent.setup();
    render(<QuizTestRoutes />);

    await user.click(screen.getAllByRole("radio")[0]);
    expect(screen.getByText("1 of 5")).toBeTruthy();
    await user.click(screen.getByRole("link", { name: "Open responsible sharing quiz" }));
    expect(screen.getByRole("heading", { name: "Responsible sharing & privacy" })).toBeTruthy();
    expect(screen.getByText("0 of 5")).toBeTruthy();
    expect(screen.getAllByRole("radio").every((radio) => !radio.checked)).toBe(true);

    await user.click(screen.getByRole("link", { name: "Leave quiz" }));
    expect(screen.getByText("Learn index")).toBeTruthy();
    await user.click(screen.getByRole("link", { name: "Return to basics quiz" }));

    expect(screen.getByRole("heading", { name: "Deepfake basics" })).toBeTruthy();
    expect(screen.getByText("0 of 5")).toBeTruthy();
    expect(screen.getAllByRole("radio").every((radio) => !radio.checked)).toBe(true);
  });

  it("shows a useful fallback for an unknown quiz slug", () => {
    render(<QuizTestRoutes initialPath="/learn/unknown-topic/quiz" />);

    expect(screen.getByRole("heading", { name: "Choose a learning topic." })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to Learn" }).getAttribute("href")).toBe("/learn");
    expect(screen.queryByText("You scored 0 of 5.")).toBeNull();
  });
});
