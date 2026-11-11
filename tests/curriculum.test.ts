import { describe, expect, it } from "vitest";
import { CUSTOM_PHASES, blankDayState, computeProgress, generatePath, revisionForNextDay, scoreQuiz } from "@/lib/curriculum";
import { runJavaScript } from "@/lib/runner";
import { TOPIC_BANKS } from "@/lib/topics";
import { GOAL_PRESETS } from "@/types";

describe("topic banks", () => {
  it("every preset goal has 12-20 topics", () => {
    for (const g of GOAL_PRESETS) {
      const bank = TOPIC_BANKS[g.id];
      expect(bank, g.id).toBeDefined();
      expect(bank.length).toBeGreaterThanOrEqual(12);
      expect(bank.length).toBeLessThanOrEqual(20);
    }
  });
  it("every topic has lesson, concepts, tasks, exercise and illustration", () => {
    for (const bank of Object.values(TOPIC_BANKS)) {
      for (const t of bank) {
        expect(t.lesson.split(".").length).toBeGreaterThanOrEqual(3);
        expect(t.concepts.length).toBeGreaterThanOrEqual(3);
        expect(t.tasks.length).toBeGreaterThanOrEqual(2);
        expect(t.exercise.length).toBeGreaterThan(10);
        expect(t.illustration).toBeTruthy();
      }
    }
  });
  it("every quiz question has 4 options and exactly one correct answer", () => {
    for (const bank of Object.values(TOPIC_BANKS)) {
      for (const t of bank) {
        expect(t.quiz.length).toBe(3);
        for (const q of t.quiz) {
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.explanation.length).toBeGreaterThan(5);
        }
      }
    }
  });
});

describe("generatePath", () => {
  it("a 4-week preset path has 28 days in bank order, then practice days", () => {
    const path = generatePath("kubernetes", "Kubernetes", 4);
    expect(path.length).toBe(28);
    const bank = TOPIC_BANKS.kubernetes;
    path.slice(0, bank.length).forEach((d, i) => expect(d.topic.id).toBe(bank[i].id));
    expect(path[bank.length].kind).toBe("practice");
    expect(path[0].week).toBe(1);
    expect(path[27].week).toBe(4);
  });
  it("a 1-week path has 7 days", () => {
    expect(generatePath("python", "Python", 1).length).toBe(7);
  });
  it("a custom goal produces the phased template in order", () => {
    const path = generatePath("custom", "Learn Rust", 2, true);
    expect(path.length).toBe(14);
    expect(path[0].topic.title).toContain(CUSTOM_PHASES[0]);
    expect(path[path.length - 1].topic.title).toContain(CUSTOM_PHASES[CUSTOM_PHASES.length - 1]);
    expect(path[0].topic.lesson).toContain("template");
  });
});

describe("quiz scoring, adaptation and XP", () => {
  const topic = TOPIC_BANKS.react[0];
  it("scores quizzes as a percentage", () => {
    const allRight = topic.quiz.map((q) => q.correctIndex);
    expect(scoreQuiz(allRight, topic)).toBe(100);
    const allWrong = topic.quiz.map((q) => (q.correctIndex + 1) % 4);
    expect(scoreQuiz(allWrong, topic)).toBe(0);
  });
  it("a quiz below 70% creates a revision block for the next day", () => {
    const day = generatePath("react", "React", 1)[0];
    const state = { ...blankDayState(day.topic), quizScore: 33 };
    const rev = revisionForNextDay(day, state);
    expect(rev).not.toBeNull();
    expect(rev?.reason).toBe("low-quiz");
    expect(rev?.concepts).toEqual(day.topic.concepts);
  });
  it("an I'm-stuck flag creates a revision block; a good quiz does not", () => {
    const day = generatePath("react", "React", 1)[0];
    expect(revisionForNextDay(day, { ...blankDayState(day.topic), stuck: true })).not.toBeNull();
    expect(revisionForNextDay(day, { ...blankDayState(day.topic), quizScore: 100 })).toBeNull();
  });
  it("computes progress %, XP, streak and quiz average", () => {
    const path = generatePath("docker", "Docker", 1);
    const days = path.map((d) => blankDayState(d.topic));
    days[0] = { ...days[0], completed: true, quizScore: 100 };
    days[1] = { ...days[1], completed: true, quizScore: 50 };
    days[3] = { ...days[3], completed: true, quizScore: 80 };
    const p = computeProgress(days);
    expect(p.completedCount).toBe(3);
    expect(p.percent).toBe(43);
    expect(p.xp).toBe(50 + 30 + 50 + 15 + 50 + 24);
    expect(p.streak).toBe(2); // day 3 not completed breaks the in-order run
    expect(p.quizAverage).toBe(77);
  });
});

describe("JS runner", () => {
  it("captures console.log output and errors", () => {
    expect(runJavaScript("console.log('hi', 1 + 2)").output).toEqual(["hi 3"]);
    expect(runJavaScript("throw new Error('boom')").error).toContain("boom");
  });
});
