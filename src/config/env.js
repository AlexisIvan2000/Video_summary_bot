import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    API_BASE_URL: process.env.API_BASE_URL,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
}