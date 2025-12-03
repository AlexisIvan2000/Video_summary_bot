import TelegramBot from "node-telegram-bot-api";
import { botConfig } from "../config/botConfig.js";
import { sendSummaryRequest } from "../api/callApi.js";
import { messages } from "../config/messages.js";
import { validateEmail, validateUrl } from "../utils/validation.js";

const bot = new TelegramBot(botConfig.token, { polling: botConfig.polling });

const userStates = {};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, messages.start);
  userStates[msg.chat.id] = { step: "awaiting_url" };
});
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!userStates[chatId]) return;
  const state = userStates[chatId];

  if (state.step === "awaiting_url") {
    if (!validateUrl(text)) {
      bot.sendMessage(chatId, messages.invalidUrl);
      return;
    }
    state.url = text;
    state.step = "awaiting_language";
    bot.sendMessage(chatId, messages.askLanguage);
  }

  if (state.step === "awaiting_language") {
    state.lang = text.toUpperCase();
    state.step = "awaiting_email";
    bot.sendMessage(chatId, messages.askEmail);
  }

  if (state.step === "awaiting_email") {
    if (!validateEmail(text)) {
      bot.sendMessage(chatId, messages.invalidEmail);
      return;
    }
    state.email = text;
    bot.sendMessage(chatId, messages.processing);

    try {
      await sendSummaryRequest(state.url, state.lang, state.email);
      bot.sendMessage(
        chatId,
        "Your request has been processed successfully. Please check your email for the summary."
      );
    } catch (error) {
      bot.sendMessage(
        chatId,
        "There was an error processing your request. Please try again later."
      );
    }
    delete userStates[chatId];
  }
});

export default bot;
