import { GoogleGenAI } from "@google/genai";
import { DateTime } from "luxon";
import { extractJSON } from "../utils/jsonUtils";
import { calculateLifePath } from "../utils/numerologyUtils";

export interface BirthData {
  date: string;
  time: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
}

export const analyzeBirthChart = async (data: BirthData) => {
  const dt = DateTime.fromISO(`${data.date}T${data.time}`, { zone: data.timezone });
  const providedOffset = dt.isValid ? dt.offset / 60 : "Unknown";
  const now = new Date().toISOString();
  
  const prompt = `Analyze the birth chart for the following subject:
  Birth Date: ${data.date}
  Birth Time: ${data.time} (Local Time)
  Birth Location: ${data.location}
  User-Provided Timezone/Zone: ${data.timezone} (Calculated Offset: ${providedOffset})
  Current Reference Time: ${now}

  CRITICAL ACCURACY PROTOCOL:
  1. GEOLOCATION: Identify the exact coordinates (lat/lng) for "${data.location}".
  2. HISTORICAL CHRONOLOGY: Research the specific time zone and Daylight Saving Time (DST) rules for "${data.location}" on the date ${data.date}. 
     - Was DST in effect at ${data.time} on that day?
     - What was the EXACT UTC offset (e.g., -5, -4, +1, etc.)?
  3. UTC SYNCHRONIZATION: Convert ${data.time} local time to absolute UTC. This is the most critical step for the Moon sign.
  4. LUNAR PRECISION: The Moon moves quickly (~0.5° per hour). Calculate its position for the EXACT UTC moment. 
     - If the Moon is within 2 degrees of a sign change, perform a high-precision verification.
  5. ASCENDANT CALCULATION: Determine the Rising Sign based on the precise local sidereal time at the birth coordinates.
  6. ZODIAC SYSTEM: Use the TROPICAL ZODIAC and PLACIDUS HOUSE SYSTEM.

  Return the analysis in this JSON format:
  {
    "sunSign": "string",
    "moonSign": "string",
    "risingSign": "string",
    "summary": "string (Markdown, analytical and grounded tone)",
    "traits": ["string", "string", ...],
    "chartData": {
      "ascendant": number (0-360),
      "planets": [
        { "name": "string", "degree": number (0-360), "sign": "string" }
      ]
    },
    "metadata": {
      "verifiedUtcOffset": number,
      "isDstActive": boolean,
      "calculationNotes": "Brief explanation of the UTC conversion used"
    }
  }`;

  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Use the more capable Pro model for mathematical accuracy
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Gemini request timed out")), 60000);
      });

      const response = await Promise.race([
        ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        }),
        timeoutPromise
      ]) as any;

      if (!response || !response.text) {
        throw new Error("Empty response from Gemini");
      }

      const result = extractJSON<any>(response.text);
      
      // Post-processing to ensure no "Unknown" values
      if (result.sunSign === "Unknown") result.sunSign = "Calculating...";
      if (result.moonSign === "Unknown") result.moonSign = "Calculating...";
      if (result.risingSign === "Unknown") result.risingSign = "Calculating...";
      
      // Ensure lifePath is correct using manual calculation
      result.lifePath = calculateLifePath(data.date);
      
      return result;
    } catch (error) {
      attempt++;
      console.error(`Gemini birth chart analysis attempt ${attempt} failed`, error);
      
      if (attempt > maxRetries) {
        // Fallback with manual life path even if Gemini fails
        return {
          sunSign: "Calculating...",
          moonSign: "Calculating...",
          risingSign: "Calculating...",
          lifePath: calculateLifePath(data.date),
          summary: "The archive is currently experiencing high resonance interference. Please try re-calibrating in a moment.",
          chartData: {
            ascendant: 0,
            planets: []
          }
        };
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  // Should not reach here due to return in catch if attempt > maxRetries
  return {
    sunSign: "Calculating...",
    moonSign: "Calculating...",
    risingSign: "Calculating...",
    lifePath: calculateLifePath(data.date),
    summary: "Resonance failure.",
    chartData: { ascendant: 0, planets: [] }
  };
};

export const getHoraryAnswer = async (question: string, location: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const now = new Date();
  const offset = -now.getTimezoneOffset() / 60;
  const prompt = `As an expert horary astrologer, answer the following question: "${question}". 
  The question was asked at ${now.toISOString()} (Local time: ${now.toLocaleString()}, UTC offset: ${offset}) in ${location}. 
  Analyze the current planetary positions and provide a clear 'Yes' or 'No' answer with a detailed, practical explanation.
  Avoid mystical jargon. Focus on logical deductions and clear advice.
  Format the response as a JSON object with fields: answer (string), explanation (string), and keyPlanets (array of objects with name and role).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return extractJSON<any>(response.text);
};

export const getTransitNotifications = async (data: BirthData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const dt = DateTime.fromISO(`${data.date}T${data.time}`, { zone: data.timezone });
  const offset = dt.offset / 60;
  const now = new Date();
  const prompt = `As an expert analyst, identify significant planetary transits for someone with the following birth data:
  Born: ${data.date} at ${data.time} (UTC offset: ${offset}, Timezone: ${data.timezone}) in ${data.location}.
  Current Time: ${now.toISOString()}.
  
  Focus on significant movements like planets entering new houses or forming major aspects to the natal chart.
  Provide 1-3 short, practical, and grounded notifications (max 100 characters each).
  Avoid mystical jargon. Focus on clear, usable observations.
  Format the response as a JSON object with a field "notifications" which is an array of objects with "message" (string) and "type" (one of "info", "warning", "success").`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  try {
    const text = response.text;
    const json = extractJSON<any>(text);
    return json.notifications || [];
  } catch (e) {
    console.error("Failed to parse transit notifications", e);
    return [];
  }
};
