import OpenAI from "openai";
import { ENV } from "../config/env.js";


const openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY });

export async function summarizeText(text, lang) {
    const prompt = `Summarize the following content in ${lang}.
    Provide:
    1. Key ideas
    2. Main arguments
    3. Important Steps (if relevant)
    4. A final short conclusion
    Content: ${text}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
    });
    return response.choices[0].message.content;
}