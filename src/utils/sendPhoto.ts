import { PhotoBotMessage } from "./types";

const sendPhoto = async ({photoMessage}: {photoMessage: PhotoBotMessage}) => {
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_KEY}/sendPhoto`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(photoMessage)
    }) 
};

export default sendPhoto;
