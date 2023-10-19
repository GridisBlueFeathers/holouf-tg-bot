import { type Chat } from "./types";

const sendMessage = async ({message, chat}: {message: string, chat: Chat}) => {
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_KEY}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            chat_id: chat.id,
            text: message
        })
    }) 
};

export default sendMessage;
