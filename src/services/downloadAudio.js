import { exec } from "child_process";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    
    const filename = `${uuid()}.mp3`;

    
    const outputPath = path.join(process.cwd(), "tmp", "audio", filename);

   
    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;

    console.log("YT-DLP command:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("yt-dlp ERROR:", stderr);
        return reject(error);
      }

      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
      console.log("Checking file exists:", outputPath);

    
      if (!fs.existsSync(outputPath)) {
        console.error(" File NOT FOUND after download:", outputPath);
        return reject(new Error("FILE_NOT_CREATED"));
      }

      console.log("Audio file exists:", outputPath);
      resolve(outputPath);
    });
  });
}
