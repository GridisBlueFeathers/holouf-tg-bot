import sendMessage from "@/utils/sendMessage";
import { Update } from "@/utils/types";

export async function POST(request: Request) {
    const update = await request.json() as Update;
    
    if (!update.message.text || !update.message.chat) {
        return new Response("OK");
    };

    // this handles bot commands
    if (update.message.entities && update.message.entities.filter(entity => entity.type === "bot_command").length) {
        const command = update.message.entities.filter(entity => entity.type === "bot_command")[0];
        const commandName = update.message.text.slice(command.offset + 1, command.offset + command.length);

        switch (commandName) {
            case "yo":
                await sendMessage({message: "yo yo", chat: update.message.chat});
                break;
        };
        return new Response("OK");
    };

    // this handles other messages in private chats
    if (update.message.chat.type === "private") {
        await sendMessage({message: update.message.text, chat: update.message.chat});
        return new Response("OK");
    };

    return new Response("OK");
};
