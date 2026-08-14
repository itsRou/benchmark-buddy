export interface ComparisonItem {
  name: string;
  rank: number;
  emoji: string;
  keyStat: string;
  scores: Record<string, string>;
  blurb: string;
}

export interface BenchmarkMeta {
  name: string;
  importance: "high" | "medium" | "low";
  why: string;
}

export interface ComparisonResult {
  title: string;
  summary: string;
  items: ComparisonItem[];
  benchmarks: BenchmarkMeta[];
  verdict: string;
  funFact: string;
  sources: { title: string; url: string }[];
}
