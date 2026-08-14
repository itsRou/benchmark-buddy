import Anthropic from "@anthropic-ai/sdk";
import { tavilySearch } from "@/lib/tavily";
import type { ComparisonResult } from "@/lib/types";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Benchmark Buddy, a playful but rigorous research agent. The user gives you a topic they want compared (products, teams, players, models, tools, anything measurable). You are handed a set of live web search results about that topic.

Your job:
1. Figure out the actual set of things being compared (the contenders).
2. Pull out the real benchmark numbers / scores / stats mentioned in the search results. Only use numbers that actually appear in the provided sources — never invent stats.
3. Decide which of those numbers actually MATTER for judging the topic, and which are noise or vanity metrics. Explain why in one short sentence each.
4. Rank the contenders overall based on the important numbers, and give each a fun one-line verdict.
5. Write a short, punchy overall verdict and one surprising fun fact you noticed.

Respond with ONLY valid JSON matching this exact TypeScript shape, no markdown fences, no commentary outside the JSON:

{
  "title": string,               // short catchy title for this comparison
  "summary": string,             // 1-2 sentence summary of what's being compared
  "items": [
    {
      "name": string,
      "rank": number,            // 1 = best, increasing
      "emoji": string,           // one single emoji that fits this contender
      "keyStat": string,         // the single most important number/stat for this item, formatted for humans
      "scores": { [benchmarkName: string]: string },  // benchmark name -> value as it appears in sources
      "blurb": string            // fun one-liner on why it ranks where it does
    }
  ],
  "benchmarks": [
    {
      "name": string,
      "importance": "high" | "medium" | "low",
      "why": string               // one short sentence on why this metric matters (or doesn't)
    }
  ],
  "verdict": string,             // 1-2 sentence bottom-line takeaway
  "funFact": string              // one surprising or fun observation from the data
}

Keep it tight: 3-6 items max, 3-8 benchmarks max. If the search results don't have enough real data for a fair comparison, still return your best structured attempt but say so plainly in "summary".`;

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return Response.json({ error: "Please provide a topic to compare." }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "Server is missing ANTHROPIC_API_KEY. Add it in your Vercel project settings." },
        { status: 500 }
      );
    }
    if (!process.env.TAVILY_API_KEY) {
      return Response.json(
        { error: "Server is missing TAVILY_API_KEY. Add it in your Vercel project settings." },
        { status: 500 }
      );
    }

    const searchResults = await tavilySearch(`${topic} comparison benchmark scores statistics`);

    if (searchResults.length === 0) {
      return Response.json(
        { error: "Couldn't find any live data for that topic. Try rephrasing it." },
        { status: 404 }
      );
    }

    const sourcesBlock = searchResults
      .map(
        (r, i) =>
          `[Source ${i + 1}] ${r.title}\nURL: ${r.url}\nContent: ${r.content.slice(0, 2000)}`
      )
      .join("\n\n---\n\n");

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Topic to compare: "${topic}"\n\nLive search results:\n\n${sourcesBlock}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from model");
    }

    let parsed: Omit<ComparisonResult, "sources">;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      const match = textBlock.text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Model did not return valid JSON");
      parsed = JSON.parse(match[0]);
    }

    const result: ComparisonResult = {
      ...parsed,
      sources: searchResults.slice(0, 6).map((r) => ({ title: r.title, url: r.url })),
    };

    return Response.json(result);
  } catch (err) {
    console.error(err);
    const messageText = err instanceof Error ? err.message : "Something went wrong.";
    return Response.json({ error: messageText }, { status: 500 });
  }
}
