import { calculatorTool } from "./calculator";
import { getCurrentDateTimeTool } from "./date-time";
import { getWeatherTool } from "./weather";
import { webSearchTool } from "./web-search";

export const tools = {
  calculator: calculatorTool,
  getCurrentDateTime: getCurrentDateTimeTool,
  getWeather: getWeatherTool,
  webSearch: webSearchTool,
};

export type ChatTools = typeof tools;