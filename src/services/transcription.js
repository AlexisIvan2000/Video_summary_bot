import { createClient } from "@deepgram/sdk";
import { ENV } from "../config/env.js";
import fs from "fs";

const deepgram = new createClient(ENV.DEEPGRAM_API_KEY);

export async function transcribeAudio(audioPath) {
  try {
    const audioFile = fs.readFileSync(audioPath);

    const response = await deepgram.listen.prerecorded.transcribeFile(
      audioFile,
      {
        model: "nova-2-general", 
        smart_format: true       
      }
    );

    const transcript =
      response?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    if (!transcript) {
      console.error(
        " Deepgram response was:",
        JSON.stringify(response, null, 2)
      );
      throw new Error("NO_TRANSCRIPT");
    }

    return transcript;

  } catch (err) {
    console.error("Deepgram Error:", err);
    throw err;
  }
}