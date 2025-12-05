import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const TMP_DIR = path.resolve("src/tmp/audio");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

export async function downloadAudio(url) {
  console.log("Downloading audio...");

  const id = uuidv4();
  const webmPath = path.join(TMP_DIR, `${id}.webm`);
  const wavPath = path.join(TMP_DIR, `${id}.wav`);


  let ytCommand = `yt-dlp -f "bestaudio" --no-playlist -o "${webmPath}" "${url}"`;

  try {
    console.log("Running:", ytCommand);
    await execPromise(ytCommand);
  } catch (err) {
    console.warn(" bestaudio unavailable — Falling back to best (video+audio)");

    
    ytCommand = `yt-dlp -f "best" --no-playlist -o "${webmPath}" "${url}"`;
    await execPromise(ytCommand);
  }


  if (!fs.existsSync(webmPath)) {
    throw new Error("Download failed — file missing");
  }
  console.log(" Video downloaded:", webmPath);


  const ffmpegCmd = `ffmpeg -y -i "${webmPath}" -ac 1 -ar 16000 -c:a pcm_s16le "${wavPath}"`;

  console.log("Converting to WAV:", ffmpegCmd);
  await execPromise(ffmpegCmd);

  if (!fs.existsSync(wavPath)) {
    throw new Error(" WAV conversion failed");
  }

  console.log("WAV created:", wavPath);

  return wavPath;
}


function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (stdout) console.log("stdout:", stdout);
      if (stderr) console.log("stderr:", stderr);
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
