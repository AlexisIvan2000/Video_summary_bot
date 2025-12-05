import fs from "fs";
import path from "path";

const lockFile = path.join(process.cwd(), "processingUsers.json");

function load() {
  if (!fs.existsSync(lockFile)) return {};
  return JSON.parse(fs.readFileSync(lockFile, "utf8"));
}

function save(data) {
  fs.writeFileSync(lockFile, JSON.stringify(data, null, 2));
}

export function isProcessing(userId) {
  let locks = load();
  return locks[userId] === true;
}

export function lockUser(userId) {
  let locks = load();
  locks[userId] = true;
  save(locks);
}

export function releaseUser(userId) {
  let locks = load();
  delete locks[userId];
  save(locks);
}
