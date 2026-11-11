"use client";

export type AikoMood = "normal" | "happy" | "thinking";

/** Aiko Sensei — an original anime-style tutor, drawn entirely as inline
 *  SVG in code. No external images, no copyrighted characters.
 *  Expressions: normal (teaching), happy (celebrating), thinking
 *  (encouraging / when you are stuck). */
export default function AikoSensei({ mood = "normal", size = 120 }: { mood?: AikoMood; size?: number }) {
  const happy = mood === "happy";
  const thinking = mood === "thinking";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`Aiko Sensei (${mood})`} className="shrink-0">
      {/* hair back */}
      <circle cx="60" cy="58" r="42" fill="#7c5cd6" />
      <rect x="14" y="52" width="18" height="48" rx="9" fill="#7c5cd6" />
      <rect x="88" y="52" width="18" height="48" rx="9" fill="#7c5cd6" />
      {/* face */}
      <circle cx="60" cy="58" r="34" fill="#ffe3d3" />
      {/* hair fringe */}
      <path d="M26 56 Q30 24 60 22 Q90 24 94 56 Q82 40 72 44 Q66 32 58 42 Q44 34 38 46 Q30 44 26 56 Z" fill="#8b6be8" />
      {/* star hairpin */}
      <path d="M84 38 l2.5 5 5.5.7 -4 3.8 1 5.4 -4.9-2.7 -4.9 2.7 1-5.4 -4-3.8 5.5-.7 Z" fill="#ffd166" stroke="#e0a800" strokeWidth="0.7" />
      {/* blush */}
      <ellipse cx="40" cy="68" rx="6" ry="3" fill="#ffb3c1" opacity="0.8" />
      <ellipse cx="80" cy="68" rx="6" ry="3" fill="#ffb3c1" opacity="0.8" />
      {/* eyes */}
      {happy ? (
        <>
          <path d="M38 60 Q45 52 52 60" stroke="#33272a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M68 60 Q75 52 82 60" stroke="#33272a" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="45" cy="60" rx="4.5" ry="6" fill="#33272a" />
          <ellipse cx="75" cy="60" rx="4.5" ry="6" fill="#33272a" />
          <circle cx="46.8" cy="57.5" r="1.8" fill="#fff" />
          <circle cx="76.8" cy="57.5" r="1.8" fill="#fff" />
        </>
      )}
      {/* eyebrows: raised when thinking */}
      {thinking ? (
        <>
          <path d="M38 50 Q45 45 52 49" stroke="#5b21b6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M68 49 Q75 45 82 50" stroke="#5b21b6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M38 51 Q45 48 52 51" stroke="#5b21b6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M68 51 Q75 48 82 51" stroke="#5b21b6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* mouth */}
      {happy ? (
        <path d="M52 72 Q60 80 68 72 Q60 76 52 72 Z" fill="#b23a48" />
      ) : thinking ? (
        <circle cx="60" cy="74" r="2.6" fill="#b23a48" />
      ) : (
        <path d="M54 72 Q60 76.5 66 72" stroke="#b23a48" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      {/* thinking: hand-to-chin sparkle / happy: confetti stars */}
      {thinking && <text x="94" y="30" fontSize="14">💭</text>}
      {happy && (
        <>
          <text x="6" y="24" fontSize="12">✨</text>
          <text x="100" y="58" fontSize="12">✨</text>
        </>
      )}
      {/* neckerchief */}
      <path d="M48 88 L60 100 L72 88 L66 86 L60 92 L54 86 Z" fill="#ff6b9d" />
    </svg>
  );
}

export function AikoBubble({ mood = "normal", children }: { mood?: AikoMood; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <AikoSensei mood={mood} size={84} />
      <div className="relative flex-1 rounded-2xl rounded-tl-sm border-2 border-purple-200 bg-white p-4 text-[15px] leading-relaxed text-zinc-800 shadow-sm">
        <p className="mb-1 text-xs font-bold tracking-wide text-purple-600">AIKO SENSEI</p>
        {children}
      </div>
    </div>
  );
}
