# Benchmark Buddy 🏆

Give it any topic — products, teams, players, models, tools, anything measurable — and Benchmark Buddy searches the live web for real benchmark numbers, ranks the contenders, and tells you which stats actually matter (and which are just noise).

**[Try it live](#)** _(add your Vercel URL here after deploying)_

## How it works

1. You type a topic (or tap a suggested comparison).
2. The app searches the web via the [Tavily](https://tavily.com/) API for current data on that topic.
3. Those search results are handed to Claude ([Anthropic API](https://console.anthropic.com/)), which extracts the real numbers, ranks the contenders, and explains which benchmarks are actually important versus vanity metrics.
4. Results render as a playful scoreboard with medals, key stats, and a bottom-line verdict.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for the fun animations
- [Anthropic API](https://docs.anthropic.com/) (Claude) for reasoning about which numbers matter
- [Tavily API](https://tavily.com/) for live web search
- Deployed on [Vercel](https://vercel.com/)

## Running locally

```bash
npm install
cp .env.example .env.local
# then fill in ANTHROPIC_API_KEY and TAVILY_API_KEY in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Import this repo into [Vercel](https://vercel.com/new).
2. Add the environment variables `ANTHROPIC_API_KEY` and `TAVILY_API_KEY` in the project's settings.
3. Deploy.

## Environment variables

| Variable            | Description                                              |
| ------------------- | ---------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | API key from [console.anthropic.com](https://console.anthropic.com/) |
| `TAVILY_API_KEY`    | API key from [tavily.com](https://tavily.com/)             |

## License

MIT
