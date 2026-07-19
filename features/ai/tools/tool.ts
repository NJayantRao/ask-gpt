import { groq } from "@ai-sdk/groq";
import { calculatorTool } from "./calculator";
import { getWeatherTool } from "./weather";
import { getCurrentDateTimeTool } from "./date-time";

export const tools = {
  calculator: calculatorTool,
  getCurrentDateTime: getCurrentDateTimeTool,
  getWeather: getWeatherTool,
  browser_search: groq.tools.browserSearch({}),
};

export type ChatTools = typeof tools;