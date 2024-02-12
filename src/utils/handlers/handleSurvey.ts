import sendMessage from "../sendMessage";

const handleSurvey = async ({chatId}: {chatId: number}) => {
	await sendMessage({message: {
		chat_id: chatId,
		text: "Вітаю! Щоб отримати доступ до чату Hololive Ukrainian Fans, спочатку заповніть невеличку анкету.",
		entities: [
			{
				offset: 89,
				length: 6,
				type: "text_link",
				url: "https://forms.gle/eh8qA6oW9e7kc77D8",
			}
		],
		link_preview_options: {
			url: "https://forms.gle/eh8qA6oW9e7kc77D8",
		},
	}});
}

export default handleSurvey;
