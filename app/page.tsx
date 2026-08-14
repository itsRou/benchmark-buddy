"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import ResultView from "@/components/ResultView";
import { randomSuggestions } from "@/lib/suggestions";
import type { ComparisonResult } from "@/lib/types";

const LOADING_LINES = [
  "Digging through the internet's junk drawer...",
  "Chasing down real numbers...",
  "Arguing with itself about what actually matters...",
  "Politely ignoring vanity metrics...",
  "Lining up the contenders...",
  "Double-checking the math...",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [suggestions] = useState(() => randomSuggestions(6));

  async function runComparison(query: string) {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const interval = setInterval(() => {
      setLoadingLine(LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]);
    }, 1600);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.3 },
          colors: ["#ff5da2", "#6c5ce7", "#ffb703", "#ff9a76"],
        });
      }
    } catch {
      setError("Couldn't reach the server. Try again in a moment.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-10 -left-10 text-8xl opacity-30 blob-float select-none">
        📊
      </div>
      <div className="pointer-events-none absolute top-24 -right-6 text-7xl opacity-30 blob-float-slow select-none">
        🏆
      </div>
      <div className="pointer-events-none absolute bottom-10 left-8 text-7xl opacity-20 blob-float-slow select-none">
        🥇
      </div>

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl z-10"
      >
        <h1 className="font-display text-4xl sm:text-6xl text-white drop-shadow-sm">
          Benchmark Buddy 🏆
        </h1>
        <p className="mt-3 text-white/90 text-base sm:text-lg">
          Give it any topic. It hunts down the real numbers, ranks the contenders, and tells you
          which stats actually matter — and which ones are just noise.
        </p>
      </motion.header>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={(e) => {
          e.preventDefault();
          runComparison(topic);
        }}
        className="mt-8 w-full max-w-xl z-10"
      >
        <div className="flex gap-2 bg-white rounded-2xl shadow-xl p-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. best budget wireless earbuds"
            className="flex-1 px-4 py-3 rounded-xl outline-none text-[var(--ink)] placeholder:text-[var(--ink-soft)]/60"
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="font-display px-5 sm:px-6 py-3 rounded-xl bg-[var(--accent)] text-white disabled:opacity-50 hover:brightness-105 active:scale-95 transition"
          >
            {loading ? "Comparing…" : "Compare!"}
          </button>
        </div>
      </motion.form>

      <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl z-10">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => {
              setTopic(s.label);
              runComparison(s.label);
            }}
            disabled={loading}
            className="text-sm bg-white/15 hover:bg-white/25 text-white rounded-full px-3.5 py-1.5 backdrop-blur-sm border border-white/30 transition disabled:opacity-40"
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <div className="mt-10 w-full flex-1 flex items-start justify-center z-10">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-white mt-6"
            >
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                🔎
              </motion.span>
              <p className="font-display text-lg">{loadingLine}</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl px-6 py-4 text-center max-w-md"
            >
              <p className="text-2xl">😬</p>
              <p className="mt-2 text-[var(--ink)] font-semibold">{error}</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div key="result" className="w-full">
              <ResultView result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-16 text-white/70 text-xs z-10">
        Built for curious people who just want to know which numbers actually matter.
      </footer>
    </main>
  );
}
