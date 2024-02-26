import sendMessage from "@/utils/sendMessage"
import { Update } from "@/utils/types"

const yoCommand = async ({ update } : { update: Update}) => {
	await sendMessage({
		message: {
			chat_id: update.message.chat.id,
			text: "da yo",
		}
	})
}

export default yoCommand;
