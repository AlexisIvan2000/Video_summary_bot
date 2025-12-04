import TelegramBot from "node-telegram-bot-api";
import { botConfig } from "../config/botConfig.js";
import { sendSummaryRequest } from "../api/callApi.js";
import { messages } from "./messages.js";
import { validateEmail, validateUrl } from "../utils/validation.js";

const bot = new TelegramBot(botConfig.token, { polling: botConfig.polling });

const userStates = {};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, messages.start);
  userStates[msg.chat.id] = { step: "awaiting_url" };
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (typeof msg.text !== "string") {
    console.log("Ignored non-text message");
    return;
  }

  const text = msg.text.trim();

  if (
    text.startsWith("YouTube\n") ||
    (text.includes("youtu") && !text.startsWith("http"))
  ) {
    console.log("Ignored Telegram preview");
    return;
  }

  if (msg.via_bot || msg.forward_from || msg.forward_from_chat) {
    console.log("Ignored forwarded/service message");
    return;
  }

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
    return;
  }

  if (state.step === "awaiting_language") {
    state.lang = text.toUpperCase();
    state.step = "awaiting_email";
    bot.sendMessage(chatId, messages.askEmail);
    return;
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
        "Your request has been processed successfully. Check your email."
      );
    } catch (error) {
      console.error(error);
      bot.sendMessage(
        chatId,
        "An error occurred while processing your request."
      );
    }

    delete userStates[chatId];
    return;
  }
});

export default bot;
