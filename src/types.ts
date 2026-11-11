export type IllustrationKey =
  | "kubernetes" | "cloud" | "code" | "database" | "network" | "robot"
  | "chart" | "shield" | "gears" | "container" | "layers" | "terminal";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  illustration: IllustrationKey;
  concepts: string[];
  lesson: string;
  tasks: string[];
  quiz: QuizQuestion[];
  exercise: string;
  exerciseLanguage: "javascript" | "notes";
  starterCode?: string;
  sampleApproach?: string;
}

export interface GoalPreset {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
}

export interface DayLesson {
  day: number;
  week: number;
  topic: Topic;
  kind: "lesson" | "practice" | "review";
  revisitsTopicId?: string;
}

export interface RevisionBlock {
  topicTitle: string;
  concepts: string[];
  easyTask: string;
  reason: "low-quiz" | "stuck";
}

export interface DayState {
  completed: boolean;
  tasksDone: boolean[];
  quizAnswers: (number | null)[];
  quizScore: number | null;
  stuck: boolean;
  code: string;
  showSample: boolean;
}

export interface LearnerState {
  goalId: string;
  goalLabel: string;
  weeks: number;
  minutesPerDay: number;
  custom: boolean;
  days: DayState[];
  totalXp: number;
}

export const GOAL_PRESETS: GoalPreset[] = [
  { id: "kubernetes", label: "Learn Kubernetes in 4 weeks", emoji: "☸️", blurb: "Pods, services, storage and a real deployment." },
  { id: "python", label: "Learn Python", emoji: "🐍", blurb: "From first script to classes, APIs and a data tool." },
  { id: "react", label: "Learn React", emoji: "⚛️", blurb: "Components, hooks, routing and a dashboard app." },
  { id: "aws", label: "Learn AWS", emoji: "☁️", blurb: "IAM, EC2, S3, Lambda and a web app on AWS." },
  { id: "docker", label: "Learn Docker", emoji: "🐳", blurb: "Images, Compose, registries and containerising an app." },
  { id: "system-design", label: "Learn System Design", emoji: "🏗️", blurb: "Scaling, caching, queues and classic design problems." },
  { id: "machine-learning", label: "Machine Learning Basics", emoji: "🤖", blurb: "Regression, classification, neural nets and honest evaluation." },
  { id: "java-spring", label: "Java & Spring Boot", emoji: "☕", blurb: "Java, REST APIs, Spring Data and security." },
];
