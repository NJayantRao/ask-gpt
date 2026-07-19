import { tool } from "ai";
import { z } from "zod";
import { evaluateExpression, SafeMathError } from "./math";

export const calculatorTool = tool({
  description:
    "Evaluate a arithmetic expression and return the numeric result. " +
    "Use this whenever the user asks for a calculation, even a simple one, " +
    "instead of computing it yourself, so the result is guaranteed correct. " +
    "Supports +, -, *, /, %, ^ (power) and parentheses.",
  inputSchema: z.object({
    expression: z
      .string()
      .describe(
        'The arithmetic expression to evaluate, e.g. "(12 + 8) * 3 / 2"',
      ),
  }),
  execute: async ({ expression }) => {
    try {
      const result = evaluateExpression(expression);
      return { expression, result };
    } catch (error) {
      const message =
        error instanceof SafeMathError
          ? error.message
          : "Could not evaluate that expression.";
      return { expression, error: message };
    }
  },
});
