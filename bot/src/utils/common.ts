import fs from "fs";
import { chatBot } from "../bot";

// TODO: update new DB
// Temporary DB
export const filePath = process.cwd() + "/chatId.txt";

export async function sendMsgToChatId(chatId: number) {
  try {
    console.log("sendMsgToChatId: ", chatId);
    const now = Date.now();
    chatBot.api.sendMessage(chatId, `Hello ${chatId}, today is: ${now}`);
  } catch (err) {
    console.error("Fail to send msg to Chat ID: ", chatId);
    console.error(err);
  }
}

export async function getChatIds() {
  // TODO: update new DB
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const arrayOfIDs = fileContent.split("\n").map((id) => id.trim());

  return arrayOfIDs;
}

export async function sendDailyMsg() {
  console.log("sendDailyMsg");
  if (fs.existsSync(filePath)) {
    const arrayOfIDs = await getChatIds();

    arrayOfIDs.forEach((id) => !!id && sendMsgToChatId(id as any));
  }
}

export async function saveChatId(chatId: number) {
  console.log('filePath 2: ', filePath)

  // TODO: Save to DB.
  // Currently, we are only using it temporarily.
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf-8");
  }
  const arrayOfIDs = await getChatIds();

  if (!arrayOfIDs.some((id: any) => id == chatId)) {
    fs.appendFileSync(filePath, `${chatId}\n`);
  }
}
