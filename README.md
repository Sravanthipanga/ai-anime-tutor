# AI Anime Tutor — Aiko Sensei builds your learning path 🌸

Pick a goal ("Learn Kubernetes in 4 weeks"), get a daily plan with lessons, quizzes, topic illustrations and a coding sandbox — and an anime tutor who adapts when you get stuck.

**Live app: (deployment URL to be added)**

## Meet Aiko Sensei

Aiko is an original anime-style tutor drawn entirely as inline SVG in code (`src/components/AikoSensei.tsx`) — no external images, no copyrighted characters. She has three expressions:

- **Teaching (normal)** — presents every lesson in her speech bubble
- **Happy / celebrating** — reacts to correct quiz answers, day completions and XP milestones
- **Thinking / encouraging** — supports you on a wrong answer or when you click "I'm stuck", and gives the hint in every coding exercise

## Topic illustrations

Every lesson shows an original SVG illustration banner (and a thumbnail in the path overview), drawn with SVG shapes in code (`src/components/TopicIllustration.tsx`) — Kubernetes wheel, containers, cloud, code editor, terminal, database, network, robot/AI, charts, shield/security, gears and layers. No external image URLs, no stock photos.

## Features

- **Goal setup:** 8 preset goals (Kubernetes, Python, React, AWS, Docker, System Design, Machine Learning Basics, Java & Spring Boot) plus a custom goal; choose 1–12 weeks and 15/30/45/60 minutes per day
- **Curriculum generator:** each preset has a curated bank of 14 topics in learning order (lesson, key concepts, daily tasks, 3-question quiz with explanations, practice exercise). One topic per day, 7 days a week; when the bank runs out, practice/review days revisit earlier topics with fresh tasks. Custom goals get a clearly-labelled phased template: Foundations → Core Concepts → Applied Practice → Mini Project → Review & Quiz
- **Daily view:** illustration banner, Aiko's lesson bubble, key concepts, checkable tasks, in-place quiz with instant Aiko feedback, coding exercise, and a "Mark day complete" XP reward
- **Coding sandbox:** JavaScript-flavoured exercises (React path) run in your browser with console.log capture — no server execution. Other topics get an editable notes/code area plus a clearly-labelled "sample approach" reveal
- **Rule-based adaptation (honest label):** if a day's quiz scores under 70%, or you click "I'm stuck", the next day starts with a revision block revisiting that topic's key concepts plus one easier task
- **Progress tracker:** full path by week/day (done / today / locked-by-order — you can open any day), overall %, XP total, in-order streak, quiz average, reset button

## How the engine works (honestly)

v1 is **rule-based — there is no LLM and no Supabase**. Topics, lessons and quizzes come from curated banks in `src/lib/topics.ts`; the path, adaptation, XP and scoring are deterministic rules in `src/lib/curriculum.ts`. All progress persists in your browser's localStorage under a versioned key (`ai-anime-tutor-v1`) — no account, no server, nothing leaves your device. Swapping in a real LLM for lesson generation would be a v2 step; the interfaces are kept separate for exactly that.

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev     # http://localhost:3000
npm test        # vitest suite
npm run build   # production build
```

## Stack

Next.js 16.4.6, React 19, TypeScript, Tailwind CSS 4, Vitest.
