import { Chat, Update } from "../types"

const handleCommand = async ({ allowedTypes, allowedIds, command, update} : {
	allowedTypes: Chat["type"][],
	allowedIds?: number[],
	command: ({ update }: { update: Update }) => Promise<void>,
	update: Update,
}) => {
	if (allowedIds && !allowedIds.includes(update.message.chat.id)
		|| !allowedTypes.includes(update.message.chat.type)) {
		return ;
	}
	
	command({ update: update });
}

export default handleCommand;
