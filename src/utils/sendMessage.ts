import { BotMessage } from "./types";

const sendMessage = async ({message}: {message: BotMessage}) => {
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_KEY}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(message),
    }) 
};

export default sendMessage;
