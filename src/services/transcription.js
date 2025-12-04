import { createClient } from "@deepgram/sdk";
import { ENV } from "../config/env.js";
import fs from "fs";

const deepgram = new createClient(ENV.DEEPGRAM_API_KEY);

export async function transcribeAudio(audioPath) {
  const audio = fs.readFileSync(audioPath);
  const response = await deepgram.listen.prerecorded.transcribeFile(audio, {
    model: "nova",
    language: "auto",
  });
  return response.results.channels[0].alternatives[0].transcript;
}
