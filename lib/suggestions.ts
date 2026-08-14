export const SUGGESTIONS: { label: string; emoji: string }[] = [
  { label: "Best LLMs for coding right now", emoji: "🤖" },
  { label: "iPhone 16 Pro vs Galaxy S24 Ultra cameras", emoji: "📸" },
  { label: "Fastest electric cars 0-60 times", emoji: "⚡" },
  { label: "Top NBA scorers this season", emoji: "🏀" },
  { label: "Best noise-cancelling headphones", emoji: "🎧" },
  { label: "React vs Vue vs Svelte performance", emoji: "🕸️" },
  { label: "Healthiest fast food burgers", emoji: "🍔" },
  { label: "Best budget gaming laptops 2026", emoji: "💻" },
  { label: "Strongest coffee brewing methods by caffeine", emoji: "☕" },
  { label: "Most fuel-efficient SUVs", emoji: "🚙" },
  { label: "Top chess engines by rating", emoji: "♟️" },
  { label: "Best cities for remote workers", emoji: "🌆" },
];

export function randomSuggestions(count = 6) {
  const shuffled = [...SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
