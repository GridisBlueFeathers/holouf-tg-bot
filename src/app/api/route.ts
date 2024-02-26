import yoCommand from "@/utils/handlers/commands/yoCommand";
import handleApply from "@/utils/handlers/handleApply";
import handleCommand from "@/utils/handlers/handleCommand";
import handleEventAnswer from "@/utils/handlers/handleEventAnswer";
import handleEventNavigate from "@/utils/handlers/handleEventNavigate";
import handleEventRegister from "@/utils/handlers/handleEventRegister";
import handleGetForm from "@/utils/handlers/handleGetForm";
import handleStart from "@/utils/handlers/handleStart";
import handleSupergroupCommand from "@/utils/handlers/handleSupergroupCommand";
import sendMessage from "@/utils/sendMessage";
import sendPhoto from "@/utils/sendPhoto";
import { Update } from "@/utils/types";
import { NextRequest } from "next/server";

const ALLOWED_USERS = [
    "GridisBlueFeathers",
    "Toxinushka",
    "Glasiem",
    "smallhours"
];

export async function POST(request: NextRequest) {
    const update = await request.json() as Update;
    
    if (!update.message.chat || !update.message.from || !update.message.text) {
		console.log("yo");
        return new Response("OK");
    };

	if (!update.message.from?.username && update.message.chat.type == "private") {
		await sendMessage({
			message: {
				text: "Будь ласка, зробить собі юзернейм в Телергамі (його можна потім прибрати)",
				chat_id: update.message.chat.id,
			}
		})
		return new Response("OK");
	}

	if (update.message.from.username && update.message.entities && update.message.entities.filter(entity => entity.type === "bot_command").length) {
        const command = update.message.entities.filter(entity => entity.type === "bot_command")[0];
        const commandName = update.message.text.slice(command.offset + 1, command.offset + command.length);

        //const restMessage = update.message.text.slice(command.offset + command.length + 1);
		switch(commandName) {
			case "yo":
				handleCommand({
					allowedTypes: [
						"supergroup",
						"private"
					],
					command: yoCommand,
					update: update
				})
				return new Response("OK");
		}

		switch (update.message.chat.type) {
			case "supergroup":
				await handleSupergroupCommand({ update: update });
				return new Response("OK");
			case "private":
				switch (commandName) {
					//since commands are doing the same, putting them under the same case
					/*case "apply":
						await handleApply({ update: update });
						return new Response("OK");*/
					case "apply":
					case "start":
						await handleStart({ update: update });
						return new Response("OK");
				}			
				return new Response("OK");
		}

		return new Response("OK");
	}

    // this handles bot commands in private chats (deprecated for all chats commands above)
	/*if (update.message.chat.type === "private" && update.message.from.username && update.message.entities && update.message.entities.filter(entity => entity.type === "bot_command").length) {
        const command = update.message.entities.filter(entity => entity.type === "bot_command")[0];
        const commandName = update.message.text.slice(command.offset + 1, command.offset + command.length);

        //const restMessage = update.message.text.slice(command.offset + command.length + 1);
        switch (commandName) {
            case "yo":
                await sendMessage({message: {
					text: "da yo",
					chat_id: update.message.chat.id,
				}});
                break;
			// commenting for now, until handle events programmatically
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
    };*/

    // this handles other messages in private chats
    /*if (update.message.chat.type === "private" && update.message.from.username && update.message.from.username === "GridisBlueFeathers") {
        await sendMessage({message: JSON.stringify(update), chatId: update.message.chat.id});
        await sendPhoto({message: "yo", chatId: update.message.chat.id, photoId: "AgACAgIAAxkBAAICbGVAJxsdxMubLK19w5smoOM5sQG0AAJm0jEb7wgAAUqXoR-aoeAloAEAAwIAA3MAAzAE"})

        return new Response("OK");
    };*/

    //use to get within walls of a group
    if (update.message.from.username && update.message.from.username === "GridisBlueFeathers") {
        //await sendPhoto({message: JSON.stringify(update), chatId: Number(process.env.MY_TG_ID), photoId: "AgACAgIAAxkBAAICbGVAJxsdxMubLK19w5smoOM5sQG0AAJm0jEb7wgAAUqXoR-aoeAloAEAAwIAA3MAAzAE"})
        await sendPhoto({photoMessage: {
			chat_id: Number(process.env.MY_TG_ID),
			photo: "https://i.ytimg.com/vi/zm4cDVt_U5g/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLARYT8lls6UcKr8SCWffpGbHiCcZQ",
			caption: JSON.stringify(update)
		}})

        return new Response("OK");
    };

    return new Response("OK");
};
