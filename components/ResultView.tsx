"use client";

import { motion } from "framer-motion";
import type { ComparisonResult } from "@/lib/types";

const RANK_STYLES = [
  { medal: "🥇", ring: "ring-[var(--gold)]", bg: "from-amber-100 to-amber-50" },
  { medal: "🥈", ring: "ring-slate-300", bg: "from-slate-100 to-slate-50" },
  { medal: "🥉", ring: "ring-orange-300", bg: "from-orange-100 to-orange-50" },
];

const IMPORTANCE_STYLE: Record<string, string> = {
  high: "bg-[var(--accent)] text-white",
  medium: "bg-amber-300 text-amber-900",
  low: "bg-slate-200 text-slate-600",
};

export default function ResultView({ result }: { result: ComparisonResult }) {
  const sortedItems = [...result.items].sort((a, b) => a.rank - b.rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-6"
    >
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--ink)]">{result.title}</h2>
        <p className="mt-2 text-[var(--ink-soft)]">{result.summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sortedItems.map((item, i) => {
          const style = RANK_STYLES[i] ?? {
            medal: `#${item.rank}`,
            ring: "ring-white/40",
            bg: "from-white to-white",
          };
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className={`rounded-2xl p-5 bg-gradient-to-br ${style.bg} ring-2 ${style.ring} shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-display text-lg text-[var(--ink)]">{item.name}</span>
                </div>
                <span className="font-display text-xl">{style.medal}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--accent-2)]">{item.keyStat}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.blurb}</p>
              {Object.keys(item.scores ?? {}).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(item.scores).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-xs bg-white/70 rounded-full px-2.5 py-1 text-[var(--ink)] border border-black/5"
                    >
                      <span className="font-semibold">{k}:</span> {v}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <h3 className="font-display text-xl text-[var(--ink)] mb-3">
          Which numbers actually matter 🔍
        </h3>
        <div className="flex flex-col gap-2">
          {result.benchmarks.map((b) => (
            <div key={b.name} className="flex items-start gap-3">
              <span
                className={`shrink-0 text-[11px] font-bold uppercase tracking-wide rounded-full px-2 py-1 ${IMPORTANCE_STYLE[b.importance] ?? IMPORTANCE_STYLE.medium}`}
              >
                {b.importance}
              </span>
              <p className="text-sm text-[var(--ink-soft)]">
                <span className="font-semibold text-[var(--ink)]">{b.name}</span> — {b.why}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-6 bg-gradient-to-br from-[var(--accent-2)] to-[var(--accent)] text-white shadow-xl">
          <h3 className="font-display text-lg">🏁 Verdict</h3>
          <p className="mt-2 text-sm opacity-95">{result.verdict}</p>
        </div>
        <div className="rounded-3xl p-6 bg-white shadow-xl">
          <h3 className="font-display text-lg text-[var(--ink)]">✨ Fun fact</h3>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{result.funFact}</p>
        </div>
      </div>

      {result.sources?.length > 0 && (
        <div className="text-xs text-white/80 px-2">
          Sources:{" "}
          {result.sources.map((s, i) => (
            <span key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-white">
                {s.title}
              </a>
              {i < result.sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
