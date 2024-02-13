import { Update } from "@/utils/types";
import handleGetForm from "./handleGetForm";

const handleSupergroupCommand = async ({ update }: { update: Update }) => {
	try {
		if (!(update.message.chat.id === Number(process.env.ADMIN_CHAT_ID)
			|| update.message.chat.id === Number(process.env.MAIN_CHAT_ID)
			|| update.message.chat.id === Number(process.env.DEV_CHAT_ID))
			|| !update.message.entities
			|| !update.message.text) {
			return ;
		}

        const commandEntity = update.message.entities.filter(entity => entity.type === "bot_command")[0];
        const commandName = update.message.text.slice(commandEntity.offset + 1, commandEntity.offset + commandEntity.length);

		switch (commandName) {
			case "getform@hololiveuf_bot":
			case "getform":
				handleGetForm({ update: update });
				break;
		}
	} catch (err) {
		console.log(err);
	}
}

export default handleSupergroupCommand;
