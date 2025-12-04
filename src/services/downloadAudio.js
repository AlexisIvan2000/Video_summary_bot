import { exec } from "child_process";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const tmpWebm = path.join(process.cwd(), "tmp", "audio", `${id}.webm`);
    const outputWav = path.join(process.cwd(), "tmp", "audio", `${id}.wav`);

   
    const dlCmd = `yt-dlp -f bestaudio -o "${tmpWebm}" "${url}"`;

    console.log("Running:", dlCmd);

    exec(dlCmd, (err) => {
      if (err) return reject(err);

    
      const convertCmd = `ffmpeg -y -i "${tmpWebm}" -ac 1 -ar 16000 -sample_fmt s16 "${outputWav}"`;

      console.log("Converting to WAV:", convertCmd);

      exec(convertCmd, (err2) => {
        if (err2) return reject(err2);

        if (!fs.existsSync(outputWav)) {
          return reject(new Error("WAV_NOT_CREATED"));
        }

     
        fs.unlinkSync(tmpWebm);

        console.log("✔️ WAV created:", outputWav);
        resolve(outputWav);
      });
    });
  });
}
