"use client";
import type { IllustrationKey } from "@/types";

/** Original SVG illustration set — one colourful banner per category.
 *  Drawn with SVG shapes in code; no external image URLs, no stock photos. */
const BG: Record<IllustrationKey, [string, string]> = {
  kubernetes: ["#dbeafe", "#93c5fd"],
  cloud: ["#e0f2fe", "#7dd3fc"],
  code: ["#ede9fe", "#c4b5fd"],
  database: ["#dcfce7", "#86efac"],
  network: ["#ffedd5", "#fdba74"],
  robot: ["#fce7f3", "#f9a8d4"],
  chart: ["#fef9c3", "#fde047"],
  shield: ["#e0e7ff", "#a5b4fc"],
  gears: ["#f3e8ff", "#d8b4fe"],
  container: ["#cffafe", "#67e8f9"],
  layers: ["#ffe4e6", "#fda4af"],
  terminal: ["#e2e8f0", "#94a3b8"],
};

function Shapes({ k }: { k: IllustrationKey }) {
  switch (k) {
    case "kubernetes":
      return (<g><circle cx="200" cy="70" r="34" fill="#fff" stroke="#2563eb" strokeWidth="5" /><path d="M200 44 L222 82 L178 82 Z M200 44 V96 M178 82 L222 56 M222 82 L178 56" stroke="#2563eb" strokeWidth="4" fill="none" />{[70, 330].map((x) => (<g key={x}><rect x={x - 24} y="46" width="48" height="48" rx="10" fill="#60a5fa" /><rect x={x - 12} y="60" width="24" height="6" rx="3" fill="#fff" /><rect x={x - 12} y="72" width="24" height="6" rx="3" fill="#fff" /></g>))}</g>);
    case "container":
      return (<g>{[60, 155, 250].map((x, i) => (<g key={x}><rect x={x} y={i === 1 ? 34 : 58} width="86" height="52" rx="6" fill={["#f97316", "#0ea5e9", "#22c55e"][i]} /><rect x={x + 8} y={(i === 1 ? 34 : 58) + 8} width="70" height="7" rx="3.5" fill="#ffffffaa" /></g>))}<path d="M30 122 Q120 104 210 120 T390 116" stroke="#0369a1" strokeWidth="7" fill="none" strokeLinecap="round" /></g>);
    case "cloud":
      return (<g><ellipse cx="150" cy="86" rx="72" ry="34" fill="#fff" /><ellipse cx="225" cy="70" rx="58" ry="38" fill="#fff" /><ellipse cx="290" cy="88" rx="60" ry="28" fill="#fff" /><path d="M110 52 l7 14 15 2 -11 10 3 15 -14-8 -13 8 3-15 -11-10 15-2 Z" fill="#fbbf24" /></g>);
    case "code":
      return (<g><rect x="90" y="26" width="220" height="104" rx="10" fill="#312e81" /><circle cx="108" cy="40" r="4" fill="#f87171" /><circle cx="122" cy="40" r="4" fill="#fbbf24" /><circle cx="136" cy="40" r="4" fill="#4ade80" /><text x="112" y="76" fontFamily="monospace" fontSize="19" fill="#a5b4fc">{"const learn = () =>"}</text><text x="112" y="102" fontFamily="monospace" fontSize="19" fill="#86efac">{"  practice.daily()"}</text></g>);
    case "terminal":
      return (<g><rect x="80" y="24" width="240" height="108" rx="10" fill="#0f172a" /><text x="98" y="62" fontFamily="monospace" fontSize="18" fill="#4ade80">$ npm run learn</text><text x="98" y="90" fontFamily="monospace" fontSize="18" fill="#e2e8f0">✓ lesson complete</text><text x="98" y="116" fontFamily="monospace" fontSize="18" fill="#fbbf24">$ _</text></g>);
    case "database":
      return (<g><ellipse cx="200" cy="42" rx="76" ry="20" fill="#16a34a" /><path d="M124 42 v62 a76 20 0 0 0 152 0 V42" fill="#22c55e" /><ellipse cx="200" cy="72" rx="76" ry="20" fill="#4ade80" /><ellipse cx="200" cy="104" rx="76" ry="20" fill="#16a34a" /></g>);
    case "network":
      return (<g>{[[200, 40], [90, 106], [310, 106], [150, 122], [255, 122]].map(([x, y], i) => (<g key={i}><line x1="200" y1="58" x2={x} y2={y} stroke="#ea580c" strokeWidth="3" /><circle cx={x} cy={y} r={i === 0 ? 18 : 13} fill="#fb923c" stroke="#fff" strokeWidth="3" /></g>))}</g>);
    case "robot":
      return (<g><rect x="150" y="44" width="100" height="76" rx="18" fill="#fff" stroke="#db2777" strokeWidth="4" /><circle cx="180" cy="78" r="8" fill="#db2777" /><circle cx="220" cy="78" r="8" fill="#db2777" /><path d="M182 102 Q200 110 218 102" stroke="#db2777" strokeWidth="3.5" fill="none" strokeLinecap="round" /><line x1="200" y1="44" x2="200" y2="26" stroke="#db2777" strokeWidth="4" /><circle cx="200" cy="21" r="6" fill="#fbbf24" /><rect x="132" y="66" width="14" height="26" rx="7" fill="#f9a8d4" /><rect x="254" y="66" width="14" height="26" rx="7" fill="#f9a8d4" /></g>);
    case "chart":
      return (<g>{[0, 1, 2, 3].map((i) => (<rect key={i} x={110 + i * 52} y={112 - i * 22} width="36" height={20 + i * 22} rx="5" fill={["#facc15", "#fb923c", "#f472b6", "#a78bfa"][i]} />))}<path d="M96 118 L330 30" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 6" /><path d="M330 30 l-16 2 8 13 Z" fill="#7c3aed" /></g>);
    case "shield":
      return (<g><path d="M200 22 L282 48 V84 C282 118 248 136 200 148 C152 136 118 118 118 84 V48 Z" fill="#6366f1" /><path d="M168 84 l22 22 44-46" stroke="#fff" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>);
    case "gears":
      return (<g fill="#9333ea">{[[160, 76, 34], [238, 96, 26]].map(([cx, cy, r], i) => (<g key={i}><circle cx={cx} cy={cy} r={r} /><circle cx={cx} cy={cy} r={r * 0.45} fill="#f3e8ff" />{[0, 60, 120, 180, 240, 300].map((a) => (<rect key={a} x={cx - 6} y={cy - r - 9} width="12" height="16" rx="3" transform={`rotate(${a} ${cx} ${cy})`} />))}</g>))}</g>);
    case "layers":
    default:
      return (<g>{[0, 1, 2].map((i) => (<path key={i} d={`M200 ${38 + i * 32} L306 ${80 + i * 32} L200 ${122 + i * 32} L94 ${80 + i * 32} Z`} fill={["#fb7185", "#fbbf24", "#38bdf8"][i]} opacity="0.92" />))}</g>);
  }
}

export default function TopicIllustration({ kind, height = 150 }: { kind: IllustrationKey; height?: number }) {
  const [from, to] = BG[kind];
  return (
    <svg viewBox="0 0 400 150" width="100%" height={height} role="img" aria-label={`${kind} illustration`} preserveAspectRatio="xMidYMid slice" className="block">
      <defs>
        <linearGradient id={`bg-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="150" fill={`url(#bg-${kind})`} />
      <Shapes k={kind} />
    </svg>
  );
}
