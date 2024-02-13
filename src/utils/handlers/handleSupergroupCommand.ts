import { Update } from "@/utils/types";
import { kv } from "@vercel/kv";
import handleGetForm from "./handleGetForm";

const handleSupergroupCommand = async ({ update }: { update: Update }) => {
	try {
		let allowedGroups;
		const allowedGroupsStr = await kv.hget<string | null>("config", "allowedGroups");
		if (allowedGroupsStr) {
			allowedGroups = allowedGroupsStr
				.split(" ")
				.map(Number)
		}
		if (!allowedGroups
			|| !allowedGroups.some(group => group === update.message.chat.id)
			|| !update.message.entities
			|| !update.message.text) {
			return ;
		}

        const commandEntity = update.message.entities.filter(entity => entity.type === "bot_command")[0];
        const commandName = update.message.text.slice(commandEntity.offset + 1, commandEntity.offset + commandEntity.length);

		switch (commandName) {
			case "getform":
				await handleGetForm({ update: update });
				break;
		}
	} catch (err) {
		console.log(err);
	}
}

export default handleSupergroupCommand;
