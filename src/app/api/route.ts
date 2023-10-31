import handleEventAnswer from "@/utils/handlers/handleEventAnswer";
import handleEventNavigate from "@/utils/handlers/handleEventNavigate";
import handleEventRegister from "@/utils/handlers/handleEventRegister";
import sendMessage from "@/utils/sendMessage";
import sendPhoto from "@/utils/sendPhoto";
import { Update } from "@/utils/types";

const ALLOWED_USERS = [
    "GridisBlueFeathers",
    "Toxinushka",
    "Glasiem",
    "smallhours"
];

export async function POST(request: Request) {
    const update = await request.json() as Update;
    
    if (!update.message.text || !update.message.chat || !update.message.from) {
        return new Response("OK");
    };

    // this handles bot commands in private chats
    if (update.message.chat.type === "private" && update.message.from.username && ALLOWED_USERS.includes(update.message.from.username) && update.message.entities && update.message.entities.filter(entity => entity.type === "bot_command").length) {
        const command = update.message.entities.filter(entity => entity.type === "bot_command")[0];
        const commandName = update.message.text.slice(command.offset + 1, command.offset + command.length);

        const restMessage = update.message.text.slice(command.offset + command.length + 1);
        switch (commandName) {
            case "yo":
                await sendMessage({message: "yo yo", chatId: update.message.chat.id});
                break;
            case "register":
                await handleEventRegister(update.message.from)
                break;
            case "answer":
                await handleEventAnswer({ user: update.message.from, answer: restMessage });
                break;
            case "navigate":
                await handleEventNavigate({ user: update.message.from, option: restMessage });
                break;
        };
        return new Response("OK");
    };

    // this handles other messages in private chats
    if (update.message.chat.type === "private" && update.message.from.username && update.message.from.username === "GridisBlueFeathers") {
        await sendMessage({message: JSON.stringify(update), chatId: update.message.chat.id});
        await sendPhoto({message: "yo", chatId: update.message.chat.id, photoId: "AgACAgIAAxkBAAICbGVAJxsdxMubLK19w5smoOM5sQG0AAJm0jEb7wgAAUqXoR-aoeAloAEAAwIAA3MAAzAE"})

        return new Response("OK");
    };

    if (update.message.from.username && update.message.from.username === "GridisBlueFeathers") {
        await sendPhoto({message: JSON.stringify(update), chatId: process.env.MY_TG_ID, photoId: "AgACAgIAAxkBAAICbGVAJxsdxMubLK19w5smoOM5sQG0AAJm0jEb7wgAAUqXoR-aoeAloAEAAwIAA3MAAzAE"})

        return new Response("OK");
    };

    return new Response("OK");
};
