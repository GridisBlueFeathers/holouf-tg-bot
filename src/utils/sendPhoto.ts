const sendPhoto = async ({message, chatId, photoId}: {message: string, chatId: number, photoId: string}) => {
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_KEY}/sendPhoto`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            chat_id: chatId,
            caption: message,
            photo: photoId
        })
    }) 
};

export default sendPhoto;
