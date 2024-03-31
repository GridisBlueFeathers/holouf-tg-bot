import sendMessage from "@/utils/sendMessage";
import { Update } from "@/utils/types";

const applyCommand = async ({ update } : { update: Update }) => {
	// Outdated Firebase document creation
	/*if (!update.message.from?.username) {
		await sendMessage({
			message: {
				text: "Будь ласка, зробить собі юзернейм в Телергамі",
				chat_id: update.message.chat.id,
			}
		})
		return ;
	}

	const membersRef = collection(db, "members");
	const q = query(membersRef, where("tgTag", "==", update.message.from.username));
	
	const querySnapshot = await getDocs(q);
	if (querySnapshot.empty) {
		await setDoc(doc(membersRef, update.message.chat.id.toString()), {
			tgTag: update.message.from.username,
		});
	}*/
	
	await sendMessage({message: {
		chat_id: update.message.chat.id,
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

export default applyCommand;
