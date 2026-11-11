"use client";
import { useMemo, useState } from "react";
import AikoSensei, { AikoBubble, type AikoMood } from "@/components/AikoSensei";
import TopicIllustration from "@/components/TopicIllustration";
import { blankDayState, computeProgress, generatePath, revisionForNextDay, scoreQuiz } from "@/lib/curriculum";
import { runJavaScript } from "@/lib/runner";
import { useLearnerState } from "@/lib/store";
import { GOAL_PRESETS, type DayLesson, type LearnerState } from "@/types";

const SAMPLE_APPROACHES: Record<string, string> = {
  notes: "Sample approach: break the exercise into the smallest steps, do the first step completely, check it against the lesson's key concepts, then continue. Write down one thing that surprised you — that is usually the part worth revising tomorrow.",
};

export default function Home() {
  const [learner, setLearner, hydrated] = useLearnerState();
  const [goalId, setGoalId] = useState("kubernetes");
  const [customGoal, setCustomGoal] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [minutes, setMinutes] = useState(30);
  const [selectedDay, setSelectedDay] = useState(1);
  const [aikoMood, setAikoMood] = useState<AikoMood>("normal");
  const [aikoMsg, setAikoMsg] = useState<string | null>(null);
  const [runOutput, setRunOutput] = useState<{ output: string[]; error: string | null } | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const path: DayLesson[] = useMemo(() => {
    if (!learner) return [];
    return generatePath(learner.goalId, learner.goalLabel, learner.weeks, learner.custom);
  }, [learner]);

  if (!hydrated) return <main className="mx-auto max-w-5xl p-8">Loading your dojo…</main>;

  function buildPath() {
    const custom = goalId === "custom";
    const preset = GOAL_PRESETS.find((g) => g.id === goalId);
    const label = custom ? customGoal.trim() || "My custom goal" : preset?.label.replace(/^Learn /, "") ?? goalId;
    const days = generatePath(custom ? "custom" : goalId, label, weeks, custom);
    const next: LearnerState = {
      goalId: custom ? "custom" : goalId,
      goalLabel: label,
      weeks,
      minutesPerDay: minutes,
      custom,
      days: days.map((d) => blankDayState(d.topic)),
      totalXp: 0,
    };
    setLearner(next);
    setSelectedDay(1);
    setAikoMood("happy");
    setAikoMsg(`Your ${weeks}-week path to ${label} is ready — ${days.length} daily lessons, about ${minutes} minutes a day. Let's start with Day 1!`);
  }

  function patchDay(dayIndex: number, patch: Partial<LearnerState["days"][number]>) {
    if (!learner) return;
    const days = learner.days.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d));
    setLearner({ ...learner, days });
  }

  if (!learner) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex items-center gap-4">
          <AikoSensei mood="happy" size={92} />
          <div>
            <h1 className="text-3xl font-extrabold text-purple-900">AI Anime Tutor 🌸</h1>
            <p className="text-zinc-700">Aiko Sensei builds you a daily learning path — lessons, quizzes, illustrations and a coding sandbox.</p>
          </div>
        </header>

        <AikoBubble mood="normal">
          <p>Tell me what you want to learn, and I&apos;ll build your daily plan. Pick a goal below, choose your weeks and minutes a day, and we begin — one topic a day, with a quiz to check it stuck. Ganbatte! 💪</p>
        </AikoBubble>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {GOAL_PRESETS.map((g) => (
            <button key={g.id} onClick={() => setGoalId(g.id)} className={`rounded-2xl border-2 p-4 text-left shadow-sm transition ${goalId === g.id ? "border-purple-500 bg-purple-50" : "border-pink-100 bg-white hover:border-purple-300"}`}>
              <span className="text-2xl">{g.emoji}</span>
              <span className="ml-2 font-bold text-zinc-900">{g.label}</span>
              <p className="mt-1 text-sm text-zinc-600">{g.blurb}</p>
            </button>
          ))}
          <button onClick={() => setGoalId("custom")} className={`rounded-2xl border-2 p-4 text-left shadow-sm transition ${goalId === "custom" ? "border-purple-500 bg-purple-50" : "border-pink-100 bg-white hover:border-purple-300"}`}>
            <span className="text-2xl">✨</span>
            <span className="ml-2 font-bold text-zinc-900">Custom goal</span>
            <p className="mt-1 text-sm text-zinc-600">Anything else — Aiko builds a phased template plan.</p>
          </button>
        </section>

        {goalId === "custom" && (
          <input value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} placeholder='e.g. "Learn Rust for systems programming"' className="mt-4 w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-zinc-900" aria-label="Custom goal" />
        )}

        <section className="mt-6 flex flex-wrap items-end gap-6 rounded-2xl bg-white p-5 shadow-sm">
          <label className="text-sm font-semibold text-zinc-800">Weeks
            <select value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="ml-2 rounded-lg border border-purple-200 px-3 py-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (<option key={w} value={w}>{w} week{w > 1 ? "s" : ""}</option>))}
            </select>
          </label>
          <label className="text-sm font-semibold text-zinc-800">Minutes per day
            <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="ml-2 rounded-lg border border-purple-200 px-3 py-2">
              {[15, 30, 45, 60].map((m) => (<option key={m} value={m}>{m} min</option>))}
            </select>
          </label>
          <button onClick={buildPath} className="rounded-full bg-purple-600 px-6 py-3 font-bold text-white shadow hover:bg-purple-700">Build my path ✨</button>
        </section>
        <p className="mt-4 text-xs text-zinc-500">v1 is a rule-based tutor (no LLM, no account) — your progress is saved only in this browser.</p>
      </main>
    );
  }

  const progress = computeProgress(learner.days);
  const currentLearner = learner;
  const dayIndex = Math.min(selectedDay - 1, path.length - 1);
  const day = path[dayIndex];
  const dayState = learner.days[dayIndex];
  const prevDay = dayIndex > 0 ? path[dayIndex - 1] : null;
  const prevState = dayIndex > 0 ? learner.days[dayIndex - 1] : null;
  const revision = prevDay && prevState ? revisionForNextDay(prevDay, prevState) : null;

  function answerQuiz(qi: number, oi: number) {
    const answers = dayState.quizAnswers.map((a, i) => (i === qi ? oi : a));
    const score = answers.every((a) => a !== null) ? scoreQuiz(answers, day.topic) : dayState.quizScore;
    patchDay(dayIndex, { quizAnswers: answers, quizScore: score });
    const correct = day.topic.quiz[qi].correctIndex === oi;
    setAikoMood(correct ? "happy" : "thinking");
    setAikoMsg(correct ? "Correct! 🎉 " + day.topic.quiz[qi].explanation : "Not quite — let's learn from it: " + day.topic.quiz[qi].explanation);
  }

  function completeDay() {
    const wasDone = dayState.completed;
    patchDay(dayIndex, { completed: true });
    if (!wasDone) {
      setCelebrate(true);
      setAikoMood("happy");
      const newXp = computeProgress(currentLearner.days.map((d, i) => (i === dayIndex ? { ...d, completed: true } : d))).xp;
      setAikoMsg(`Day ${day.day} complete! You earned XP — total now ${newXp} XP. ${newXp >= 200 ? "Milestone reached — 200 XP club! 🏆" : "See you tomorrow for the next lesson!"}`);
      setTimeout(() => setCelebrate(false), 3500);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AikoSensei mood={aikoMood} size={60} />
          <div>
            <h1 className="text-2xl font-extrabold text-purple-900">AI Anime Tutor 🌸</h1>
            <p className="text-sm text-zinc-600">Goal: <strong className="text-zinc-900">{learner.goalLabel}</strong> · {learner.weeks} weeks · {learner.minutesPerDay} min/day</p>
          </div>
        </div>
        <button onClick={() => { setLearner(null); setAikoMsg(null); }} className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600">Reset path</button>
      </header>

      {celebrate && <div className="mb-4 rounded-2xl bg-yellow-100 p-4 text-center text-lg font-bold text-yellow-900">🎉 ✨ Day complete! Aiko is proud of you! ✨ 🎉</div>}

      <section className="mb-6 grid gap-3 sm:grid-cols-4" aria-label="Progress">
        {[
          ["Progress", `${progress.percent}% (${progress.completedCount}/${path.length} days)`],
          ["XP", `${progress.xp} XP`],
          ["Streak", `${progress.streak} day${progress.streak === 1 ? "" : "s"}`],
          ["Quiz average", progress.quizAverage ? `${progress.quizAverage}%` : "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-bold tracking-wide text-purple-500">{label.toUpperCase()}</p>
            <p className="mt-1 text-xl font-extrabold text-zinc-900">{value}</p>
          </div>
        ))}
      </section>
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-purple-100"><div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all" style={{ width: `${progress.percent}%` }} /></div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4" aria-label="Path overview">
          {Array.from({ length: learner.weeks }, (_, w) => w + 1).map((week) => (
            <div key={week} className="rounded-2xl bg-white p-3 shadow-sm">
              <h2 className="mb-2 px-1 text-sm font-extrabold text-purple-800">Week {week}</h2>
              <ul className="space-y-1">
                {path.filter((d) => d.week === week).map((d) => {
                  const st = learner.days[d.day - 1];
                  const isToday = d.day === selectedDay;
                  return (
                    <li key={d.day}>
                      <button onClick={() => { setSelectedDay(d.day); setRunOutput(null); setAikoMsg(null); setAikoMood("normal"); }} className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm ${isToday ? "bg-purple-100 font-bold" : "hover:bg-pink-50"}`}>
                        <span className="w-20 shrink-0 overflow-hidden rounded-md"><TopicIllustration kind={d.topic.illustration} height={26} /></span>
                        <span className="flex-1 text-zinc-800">Day {d.day}: {d.topic.title}</span>
                        <span>{st?.completed ? "✅" : d.day === progress.completedCount + 1 ? "📍" : "🔒"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="px-1 text-xs text-zinc-500">🔒 means not completed yet — you can open any day, and your streak counts completions in order.</p>
        </aside>

        <section className="space-y-5" aria-label={`Day ${day.day} lesson`}>
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <TopicIllustration kind={day.topic.illustration} height={160} />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-zinc-900">Day {day.day} · {day.topic.title} {day.kind !== "lesson" && <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">{day.kind}</span>}</h2>
            <button onClick={() => { patchDay(dayIndex, { stuck: true }); setAikoMood("thinking"); setAikoMsg("It's okay to be stuck — that's where learning happens! I've added a gentle revision block to tomorrow's lesson so we revisit this together. Try the easy task in today's exercise first. 🌱"); }} className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">I&apos;m stuck 🆘</button>
          </div>

          {revision && (
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
              <h3 className="font-bold text-amber-900">🔁 Revision first (rule-based adaptation)</h3>
              <p className="mt-1 text-sm text-zinc-800">Yesterday&apos;s {revision.reason === "stuck" ? "\"I'm stuck\" flag" : "quiz was under 70%"}, so we revisit <strong>{revision.topicTitle}</strong> before the new lesson:</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-800">{revision.concepts.map((c) => (<li key={c}>{c}</li>))}</ul>
              <p className="mt-2 text-sm font-semibold text-zinc-900">{revision.easyTask}</p>
            </div>
          )}

          <AikoBubble mood={aikoMood}>
            {aikoMsg ? <p>{aikoMsg}</p> : <p>{day.topic.lesson}</p>}
          </AikoBubble>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900">🔑 Key concepts</h3>
            <ul className="mt-2 flex flex-wrap gap-2">{day.topic.concepts.map((c) => (<li key={c} className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-900">{c}</li>))}</ul>
            <h3 className="mt-5 font-bold text-zinc-900">📝 Today&apos;s tasks</h3>
            <ul className="mt-2 space-y-2">
              {day.topic.tasks.map((t, i) => (
                <li key={i}>
                  <label className="flex items-start gap-2 text-[15px] text-zinc-800">
                    <input type="checkbox" checked={dayState.tasksDone[i] ?? false} onChange={(e) => patchDay(dayIndex, { tasksDone: dayState.tasksDone.map((v, j) => (j === i ? e.target.checked : v)) })} className="mt-1" />
                    <span className={dayState.tasksDone[i] ? "line-through opacity-60" : ""}>{t}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900">🧠 Quiz time {dayState.quizScore !== null && <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">Score: {dayState.quizScore}%</span>}</h3>
            <div className="mt-3 space-y-5">
              {day.topic.quiz.map((q, qi) => (
                <fieldset key={qi}>
                  <legend className="font-medium text-zinc-900">{qi + 1}. {q.question}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, oi) => {
                      const chosen = dayState.quizAnswers[qi] === oi;
                      const showResult = dayState.quizAnswers[qi] !== null;
                      return (
                        <button key={oi} onClick={() => answerQuiz(qi, oi)} className={`rounded-xl border-2 px-3 py-2 text-left text-sm ${chosen ? (oi === q.correctIndex ? "border-green-400 bg-green-50 font-bold" : "border-red-300 bg-red-50") : "border-zinc-200 hover:border-purple-300"} ${showResult && oi === q.correctIndex ? "ring-1 ring-green-300" : ""}`}>
                          {opt} {showResult && oi === q.correctIndex ? " ✓" : chosen ? " ✗" : ""}
                        </button>
                      );
                    })}
                  </div>
                  {dayState.quizAnswers[qi] !== null && <p className="mt-1 text-sm text-zinc-600">{q.explanation}</p>}
                </fieldset>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900">💻 Coding / practice exercise</h3>
            <p className="mt-1 text-[15px] text-zinc-800">{day.topic.exercise}</p>
            <AikoBubble mood="thinking"><p>Hint from Aiko: start with the first key concept — <strong>{day.topic.concepts[0]}</strong> — and build the smallest version that works. Small steps, big learning! 🌱</p></AikoBubble>
            <textarea value={dayState.code} onChange={(e) => patchDay(dayIndex, { code: e.target.value })} rows={7} spellCheck={false} className="mt-3 w-full rounded-xl border border-zinc-300 bg-zinc-950 p-3 font-mono text-sm text-green-100" aria-label="Exercise code or notes" placeholder={day.topic.exerciseLanguage === "javascript" ? "// Write JavaScript here and press Run" : "Write your notes / code here…"} />
            {day.topic.exerciseLanguage === "javascript" ? (
              <div className="mt-3">
                <button onClick={() => setRunOutput(runJavaScript(dayState.code))} className="rounded-full bg-green-600 px-5 py-2 font-bold text-white hover:bg-green-700">▶ Run code</button>
                {runOutput && (
                  <pre className="mt-3 overflow-auto rounded-xl bg-zinc-900 p-3 font-mono text-sm text-green-200">{runOutput.output.join("\n") || "(no output)"}{runOutput.error ? `\n⚠ ${runOutput.error}` : ""}</pre>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <button onClick={() => patchDay(dayIndex, { showSample: !dayState.showSample })} className="rounded-full bg-purple-100 px-5 py-2 font-bold text-purple-800">{dayState.showSample ? "Hide" : "Show"} a sample approach</button>
                {dayState.showSample && <p className="mt-3 rounded-xl bg-purple-50 p-3 text-sm text-zinc-800"><strong>Sample approach (not executed output):</strong> {day.topic.sampleApproach ?? SAMPLE_APPROACHES.notes}</p>}
              </div>
            )}
          </div>

          <button onClick={completeDay} disabled={dayState.completed} className={`w-full rounded-full py-3 text-lg font-extrabold text-white shadow ${dayState.completed ? "bg-green-400" : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"}`}>
            {dayState.completed ? "✅ Day complete — XP earned!" : `Mark day ${day.day} complete (+XP)`}
          </button>
        </section>
      </div>
    </main>
  );
}
