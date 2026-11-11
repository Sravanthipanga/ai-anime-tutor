import type { DayLesson, DayState, RevisionBlock, Topic } from "@/types";
import { TOPIC_BANKS } from "./topics";

/** Rule-based curriculum generation + progress maths. No LLM: topics come
 *  from the curated banks in topics.ts, spread 1 per day, 7 days a week.
 *  When a bank runs out, practice/review days revisit earlier topics. */

export const CUSTOM_PHASES = [
  "Foundations",
  "Core Concepts",
  "Applied Practice",
  "Mini Project",
  "Review & Quiz",
] as const;

function customTopic(goalLabel: string, phase: string, n: number): Topic {
  const title = `${phase}: ${goalLabel} (part ${n})`;
  const concepts = [
    `${phase} vocabulary for ${goalLabel}`,
    `Core ideas behind ${phase.toLowerCase()}`,
    `Common mistakes in ${phase.toLowerCase()}`,
    `Checking your understanding of ${phase.toLowerCase()}`,
  ];
  return {
    id: `custom-${phase.toLowerCase().replace(/[^a-z]+/g, "-")}-${n}`,
    title,
    illustration: phase === "Mini Project" ? "robot" : phase === "Applied Practice" ? "gears" : phase === "Review & Quiz" ? "chart" : "layers",
    concepts,
    lesson: `This is a template-plan day for your custom goal "${goalLabel}", in the ${phase} phase. Work through the key concepts below in order, using any book, course, or documentation you like for this goal. Write notes in your own words as you go — the template gives you the structure and pacing; the source material is yours to choose. Finish with the tasks and quiz check before marking the day complete.`,
    tasks: [
      `Study the ${phase.toLowerCase()} material for ${goalLabel} and note the key terms`,
      `Work one small example end to end and write down what happened`,
      `Write a 3-line summary of what you learned today`,
    ],
    quiz: [0, 1, 2].map((i) => ({
      question: `Template check ${i + 1} for ${phase}: which approach helps this phase stick?`,
      options: [
        "Skim everything once and never practise",
        "Work examples in small steps and review your notes",
        "Skip the foundations entirely",
        "Memorise terms without using them",
      ],
      correctIndex: 1,
      explanation: "Small worked examples plus review are what make a template plan effective.",
    })),
    exercise: `Template exercise (${phase}): produce one small artefact for "${goalLabel}" — a worked example, a diagram, or a page of notes — and describe it below.`,
    exerciseLanguage: "notes",
    sampleApproach: `Sample approach: pick the smallest piece of ${phase.toLowerCase()} for ${goalLabel}, work it completely, then write what you would try next. (This is a study template, not model-generated content.)`,
  };
}

export function generatePath(goalId: string, goalLabel: string, weeks: number, custom = false): DayLesson[] {
  const totalDays = weeks * 7;
  const days: DayLesson[] = [];
  if (custom || !TOPIC_BANKS[goalId]) {
    // Phased template spread over the chosen weeks.
    for (let d = 0; d < totalDays; d++) {
      const phaseIndex = Math.min(CUSTOM_PHASES.length - 1, Math.floor((d / totalDays) * CUSTOM_PHASES.length));
      const phase = CUSTOM_PHASES[phaseIndex];
      const part = days.filter((x) => x.topic.title.startsWith(phase)).length + 1;
      days.push({ day: d + 1, week: Math.floor(d / 7) + 1, topic: customTopic(goalLabel, phase, part), kind: phase === "Review & Quiz" ? "review" : "lesson" });
    }
    return days;
  }
  const bank = TOPIC_BANKS[goalId];
  for (let d = 0; d < totalDays; d++) {
    if (d < bank.length) {
      days.push({ day: d + 1, week: Math.floor(d / 7) + 1, topic: bank[d], kind: "lesson" });
    } else {
      // Practice/review day revisiting an earlier topic with fresh tasks.
      const revisit = bank[d % bank.length];
      const topic: Topic = {
        ...revisit,
        id: `${revisit.id}-practice-${d + 1}`,
        title: `Practice: ${revisit.title}`,
        tasks: [
          `Re-do the hands-on example from "${revisit.title}" without looking at your notes`,
          `Explain ${revisit.concepts[0]} out loud or in writing as if teaching it`,
          `Find one edge case or common mistake with ${revisit.concepts[1]} and note it`,
        ],
        exercise: `Practice exercise: revisit "${revisit.title}" and produce a second, different example demonstrating ${revisit.concepts[0]}.`,
      };
      days.push({ day: d + 1, week: Math.floor(d / 7) + 1, topic, kind: d % 7 === 6 ? "review" : "practice", revisitsTopicId: revisit.id });
    }
  }
  return days;
}

export function blankDayState(topic: Topic): DayState {
  return {
    completed: false,
    tasksDone: topic.tasks.map(() => false),
    quizAnswers: topic.quiz.map(() => null),
    quizScore: null,
    stuck: false,
    code: topic.starterCode ?? "",
    showSample: false,
  };
}

export function scoreQuiz(answers: (number | null)[], topic: Topic): number {
  if (topic.quiz.length === 0) return 0;
  const correct = topic.quiz.filter((q, i) => answers[i] === q.correctIndex).length;
  return Math.round((correct / topic.quiz.length) * 100);
}

/** Rule-based adaptation: a quiz below 70%, or an "I'm stuck" flag, on
 *  day N puts a revision block at the top of day N+1. */
export function revisionForNextDay(prev: DayLesson, prevState: DayState): RevisionBlock | null {
  const lowQuiz = prevState.quizScore !== null && prevState.quizScore < 70;
  if (!lowQuiz && !prevState.stuck) return null;
  return {
    topicTitle: prev.topic.title,
    concepts: prev.topic.concepts,
    easyTask: `Easy win first: re-read the lesson for "${prev.topic.title}" and redo its first task slowly.`,
    reason: prevState.stuck ? "stuck" : "low-quiz",
  };
}

export function computeProgress(days: DayState[]): { percent: number; xp: number; streak: number; quizAverage: number; completedCount: number } {
  const completedCount = days.filter((d) => d.completed).length;
  const percent = days.length === 0 ? 0 : Math.round((completedCount / days.length) * 100);
  // XP: 50 per completed day + quiz score bonus (up to 30).
  const xp = days.reduce((sum, d) => sum + (d.completed ? 50 + Math.round(((d.quizScore ?? 0) / 100) * 30) : 0), 0);
  // Streak = consecutive completed days counting in lesson order from day 1,
  // continuing while the run is unbroken.
  let streak = 0;
  for (const d of days) {
    if (d.completed) streak++;
    else break;
  }
  const scores = days.map((d) => d.quizScore).filter((s): s is number => s !== null);
  const quizAverage = scores.length === 0 ? 0 : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  return { percent, xp, streak, quizAverage, completedCount };
}
