import { collection, doc, setDoc } from "firebase/firestore";
import sendMessage from "../sendMessage";
import { db } from "@/firebase/firebase";
import { Update } from "../types";

const handleApply = async ({ update }: { update: Update}) => {
	if (!update.message.from?.username) {
		await sendMessage({
			message: {
				text: "Будь ласка, зробить собі юзернейм в Телергамі",
				chat_id: update.message.chat.id,
			}
		})
		return ;
	}

	const membersRef = collection(db, "members");
	
	await setDoc(doc(membersRef, update.message.chat.id.toString()), {
		tgTag: update.message.from.username,
	});

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

export default handleApply;
