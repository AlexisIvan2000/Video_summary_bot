import { createClient } from "@deepgram/sdk";
import { ENV } from "../config/env.js";
import fs from "fs";

const deepgram = new createClient(ENV.DEEPGRAM_API_KEY);

export async function transcribeAudio(audioPath) {
  try {
    const buffer = fs.readFileSync(audioPath);

    const response = await deepgram.listen.prerecorded.transcribeFile(buffer, {
      model: "nova-2-general",
      smart_format: true,
      diarization: false,
    });
    console.log("FULL DEEPGRAM RESPONSE = ", JSON.stringify(response, null, 2));

    const alt = response?.result?.results?.channels?.[0]?.alternatives?.[0];

    if (!alt) {
      console.error(
        "ALT DETECTED AS NULL. Full response:",
        JSON.stringify(response, null, 2)
      );
      throw new Error("NO_ALTERNATIVE");
    }

    
    let transcript = alt?.paragraphs?.transcript;

   
    if (!transcript || transcript.trim().length < 10) {
      if (Array.isArray(alt.words) && alt.words.length > 0) {
        transcript = alt.words
          .map((w) => w.punctuated_word || w.word)
          .join(" ");
      }
    }


    if (!transcript || transcript.trim().length < 10) {
      console.log("Deepgram raw response:", JSON.stringify(response, null, 2));
      throw new Error("NO_TRANSCRIPT");
    }

    return transcript;
  } catch (err) {
    console.error("Deepgram Error:", err);
    throw err;
  }
}
