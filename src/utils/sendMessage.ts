const sendMessage = async ({message, chatId}: {message: string, chatId: number}) => {
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_KEY}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    }) 
};

export default sendMessage;
