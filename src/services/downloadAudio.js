import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { v4 as uuidV4 } from "uuid";
import path from "path";
import fs from "fs";

const execPromise = promisify(exec);

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const audioDir = path.join(_dirname, "..", "tmp", "audio");


if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

export async function downloadAudio(url) {
  if (!url) throw new Error("No URL provided to downloadAudio()");

  const id = uuidV4();
  const webmPath = path.join(audioDir, `${id}.webm`);
  const wavPath = path.join(audioDir, `${id}.wav`);

  
  const ytCommand = `yt-dlp -f bestaudio --no-playlist -o "${webmPath}" "${url}"`;

  console.log("Running:", ytCommand);
  await execPromise(ytCommand);


  const ffmpegCommand = `ffmpeg -y -i "${webmPath}" \
-ac 1 -ar 16000 -c:a pcm_s16le \
"${wavPath}"`;

  console.log("Converting to WAV:", ffmpegCommand);
  await execPromise(ffmpegCommand);


  try {
    fs.unlinkSync(webmPath);
  } catch (err) {
    console.warn("Could not delete temporary .webm file:", err);
  }

  return wavPath;
}
