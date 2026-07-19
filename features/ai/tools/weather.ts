import { tool } from "ai";
import { z } from "zod";

type GeocodingResult = {
  results?: Array<{
    name: string;
    admin1?: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
};

type ForecastResult = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
};

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export const getWeatherTool = tool({
  description:
    "Get the current real-world weather for a named location (city, " +
    "region, or landmark). Use this whenever the user asks about current " +
    "weather, temperature, or conditions anywhere — never guess.",
  inputSchema: z.object({
    location: z
      .string()
      .describe('The place to get weather for, e.g. "Bhubaneswar" or "Paris, France"'),
  }),
  execute: async ({ location }) => {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        location,
      )}&count=1&language=en&format=json`,
    );

    if (!geoRes.ok) {
      return { location, error: "Could not look up that location right now." };
    }

    const geo = (await geoRes.json()) as GeocodingResult;
    const match = geo.results?.[0];

    if (!match) {
      return { location, error: `No location found matching "${location}".` };
    }

    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${match.latitude}&longitude=${match.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day`,
    );

    if (!forecastRes.ok) {
      return {
        location: match.name,
        error: "Could not fetch weather for that location right now.",
      };
    }

    const forecast = (await forecastRes.json()) as ForecastResult;
    const { current, current_units } = forecast;

    return {
      location: [match.name, match.admin1, match.country]
        .filter(Boolean)
        .join(", "),
      condition: WEATHER_CODES[current.weather_code] ?? "Unknown conditions",
      temperature: `${current.temperature_2m}${current_units.temperature_2m}`,
      feelsLike: `${current.apparent_temperature}${current_units.temperature_2m}`,
      humidity: `${current.relative_humidity_2m}%`,
      windSpeed: `${current.wind_speed_10m}${current_units.wind_speed_10m}`,
      isDaytime: current.is_day === 1,
    };
  },
});