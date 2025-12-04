import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';

export function downloadAudio(url) {
    return new Promise((resolve, reject) => {
        const filename = `${uuid()}.mp3`;
        const outputPath = path.resolve("tmp/audio", filename);

        const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;
        exec(command, (error) => {
            if (error) return reject(error);
            resolve(outputPath);
        })
    });
}