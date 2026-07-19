import { tool } from "ai";
import { z } from "zod";

export const getCurrentDateTimeTool = tool({
  description:
    "Get the current real-world date and time. Use this whenever the user " +
    "asks what the date/time is, or asks something relative to 'today', " +
    "'now', 'this year', etc. — never guess or rely on your training data " +
    "for the current date.",
  inputSchema: z.object({
    timeZone: z
      .string()
      .optional()
      .describe(
        'IANA time zone name, e.g. "America/New_York" or "Asia/Kolkata". Defaults to UTC if omitted.',
      ),
  }),
  execute: async ({ timeZone }) => {
    const now = new Date();
    const zone = timeZone || "UTC";

    try {
      const formatted = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: zone,
      }).format(now);

      return {
        timeZone: zone,
        iso: now.toISOString(),
        formatted,
      };
    } catch {
      return {
        timeZone: "UTC",
        iso: now.toISOString(),
        formatted: now.toUTCString(),
        note: `"${timeZone}" was not a recognized time zone; returned UTC instead.`,
      };
    }
  },
});