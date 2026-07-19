import { tool } from "ai";
import { z } from "zod";

type SearchResult = {
  title: string;
  url: string;
  content: string;
  score: number;
};

type SearchResponse = {
  answer?: string;
  results: SearchResult[];
};

export const webSearchTool = tool({
  description:
    "Search the live web for current information — news, facts, prices, " +
    "recent events, anything you're unsure of or that requires up-to-date " +
    "knowledge. Always use this instead of guessing when the user asks " +
    "about anything current; your training data is not current.",
  inputSchema: z.object({
    query: z.string().describe("The search query."),
    maxResults: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("How many results to return. Defaults to 5."),
  }),
  execute: async ({ query, maxResults }) => {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      return {
        query,
        error:
          "Web search is not configured — TAVILY_API_KEY is missing on the server.",
      };
    }

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          max_results: maxResults ?? 5,
          search_depth: "basic",
          include_answer: true,
        }),
      });

      if (!res.ok) {
        return {
          query,
          error: `Search request failed with status ${res.status}.`,
        };
      }

      const data = (await res.json()) as SearchResponse;

      return {
        query,
        answer: data.answer,
        results: data.results.map((result) => ({
          title: result.title,
          url: result.url,
          snippet: result.content,
        })),
      };
    } catch {
      return { query, error: "Could not reach the search service right now." };
    }
  },
});
