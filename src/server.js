import express from "express";
import { downloadAudio } from "./services/downloadAudio.js";
import { transcribeAudio } from "./services/transcription.js";
import { summarizeText } from "./services/summarizeAI.js";
import { sendEmail } from "./services/emailer.js";

const app = express();
app.use(express.json());
const PORT = 3000;

app.post("/api/summarize", async (req, res) => {
  const { url, lang, email } = req.body;
  if (!url || !lang || !email)
    return res.status(400).json({ error: "Misssing required fields" });
  try {
    console.log("Downloading audio...");
    const audioPath = await downloadAudio(url);

    console.log("Transcribing audio...");
    const transcription = await transcribeAudio(audioPath);

    console.log("Summarizing...");
    const summary = await summarizeText(transcription, lang);

    console.log("Sending email...");
    await sendEmail(email, summary);
    return res.status(200).json({ message: "Summary sent to your email" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Failed to process summary" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
