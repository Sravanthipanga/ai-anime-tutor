import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Anime Tutor — Aiko Sensei builds your learning path",
  description: "Pick a goal, get a daily learning path with an anime tutor, quizzes, topic illustrations and a coding sandbox. Rule-based v1, no account needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fff7fb] font-sans text-zinc-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
