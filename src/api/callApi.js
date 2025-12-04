import axios from "axios";
import { ENV } from "../config/env.js";

export async function sendSummaryRequest(url, lang, email) {
  try {
    const response = await axios.post(
      `${ENV.API_BASE_URL}/api/summarize`,
      {
        url,
        lang,
        email
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error("API_ERROR");
  }
}
