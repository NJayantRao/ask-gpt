import { calculatorTool } from "./calculator";
import { getCurrentDateTimeTool } from "./date-time";
import { getWeatherTool } from "./weather";


export const tools = {
  calculator: calculatorTool,
  getCurrentDateTime: getCurrentDateTimeTool,
  getWeather: getWeatherTool,
};

export type ChatTools = typeof tools;