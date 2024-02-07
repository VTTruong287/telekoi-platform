import { Menu } from "@grammyjs/menu";
import "dotenv/config";
import { Bot, InputFile } from "grammy";
import { saveChatId } from "./utils/common";
import { serviceLocator } from './services/service-locator';

// Create an instance of the `Bot` class and pass your bot token to it.
export const chatBot = new Bot(process.env.ENV_BOT_KEY || "");
// const openAI = new OpenAI({ apiKey: process.env.ENV_OPEN_AI_API_KEY || "" });

const menu = new Menu("movements")
  .text("^", (context) => context.reply("Forward!")).row()
  .text("<", (context) => context.reply("Left!"))
  .text(">", (context) => context.reply("Right!")).row()
  .text("v", (context) => context.reply("Backwards!"));

chatBot.use(menu);

// Handle the /start command.
chatBot.command("start", async (ctx) => {
  const chatId = ctx.from?.id;

  // const pathJpegImg = process.cwd() + "/public/one-piece.jpeg";
  const pathGifImg = process.cwd() + "/public/luffy.gif";

  await ctx.replyWithAnimation(new InputFile(pathGifImg));
  ctx.reply(`Welcome player - v1! Up and running. Chat ID: ${chatId}`);

  if (chatId) {
    // sendMsgToChatId(chatId);
    saveChatId(chatId);
  }
});

chatBot.command("move", (ctx) => {
  ctx.reply("Let's move out !!!", { reply_markup: menu });

  // ctx.reply('<b>Hi!</b> <i>Welcome</i> to <button href="https://grammy.dev">grammY</a>.',
  //     { parse_mode: "HTML" }
  // )
});

// Handle other messages.
chatBot.on("message", async (ctx) => {
  // console.log("ctx.message: ", JSON.stringify(ctx.message))
  const question = ctx.message.text || "";

  // const completion = await openAI.chat.completions.create({
  //     messages: [{ role: "system", content: question }],
  //     model: "gpt-3.5-turbo",
  // })

  // console.log(completion.choices[0].message.content);

  // ctx.reply(completion?.choices?.[0]?.message?.content || '')

  ctx.reply(`You said: ${question}`);
});

// Start the bot.
chatBot.start();

serviceLocator.jobService.tick();
