import { createClient } from "@deepgram/sdk";
import { ENV } from "../config/env.js";
import fs from "fs";

const deepgram = new createClient(ENV.DEEPGRAM_API_KEY);

export async function transcribeAudio(filePath) {
  console.log("Transcribing audio:", filePath);

  const audio = fs.readFileSync(filePath);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    audio,
    {
      model: "nova-2",
      smart_format: true,
      diarize: false,
      punctuate: true,
      paragraphs: true
    }
  );

  if (error) {
    console.error("Deepgram Error:", error);
    throw new Error(error);
  }

  const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

  if (!transcript || transcript.trim() === "") {
    throw new Error("NO_TRANSCRIPT");
  }

  return transcript;
}