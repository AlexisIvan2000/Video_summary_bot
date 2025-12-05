import fs from 'fs';
import path from 'path';

const usageFile = path.join(process.cwd(), "usage.json");

function load() {
  if (!fs.existsSync(usageFile)) return {};
  return JSON.parse(fs.readFileSync(usageFile, "utf8"));
}

function save(data) {
  fs.writeFileSync(usageFile, JSON.stringify(data, null, 2));
}

export function checkDailyLimit(userId, durationSec) {
  let usage = load();
  const now = Date.now();

  if (!usage[userId]) {
    usage[userId] = { usedToday: 0, lastReset: now };
  }

  const lastReset = usage[userId].lastReset;
  const oneDay = 24 * 60 * 60 * 1000;


  if (now - lastReset > oneDay) {
    usage[userId].usedToday = 0;
    usage[userId].lastReset = now;
  }

  if (usage[userId].usedToday + durationSec > 45 * 60) {
    return { allowed: false, remaining: (45 * 60) - usage[userId].usedToday };
  }

  return { allowed: true };
}

export function addUsage(userId, durationSec) {
  let usage = load();
  if (!usage[userId]) usage[userId] = { usedToday: 0, lastReset: Date.now() };

  usage[userId].usedToday += durationSec;
  save(usage);
}
