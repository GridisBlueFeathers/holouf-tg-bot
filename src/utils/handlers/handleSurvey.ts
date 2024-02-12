import sendMessage from "../sendMessage";

const handleSurvey = async ({chatId} : {chatId: number}) => {
	await sendMessage({
		message: `https://forms.gle/eh8qA6oW9e7kc77D8`,
		chatId: chatId
	})

}

export default handleSurvey;
