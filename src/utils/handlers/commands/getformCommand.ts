import { db } from "@/firebase/firebase";
import sendMessage from "@/utils/sendMessage";
import { Chat, Update } from "@/utils/types";
import { collection, query, where, limit, getDocs } from "firebase/firestore";

const getformCommand = async ({ update } : { update: Update }) => {
	try {

		const allowedChatTypes: Chat["type"][] = [
			"supergroup",
		]

		if (!update.message.entities
			|| !update.message.text
			|| !allowedChatTypes.includes(update.message.chat.type)) {
			return ;
		}

		const usertagEntity = update.message.entities.filter(entity => entity.type === "mention");

		if (!usertagEntity.length) {
			await sendMessage({
				message: {
					text: "Будь ласка, додайте юзернейм до команди",
					chat_id: update.message.chat.id
				}
			});
			return ;
		}

		const userTag = update.message.text.slice(usertagEntity[0].offset + 1, usertagEntity[0].offset + usertagEntity[0].length);

		const membersRef = collection(db, "members");
		const q = query(membersRef, where("tgTag", "==", userTag), limit(1))

		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			await sendMessage({
				message: {
					text: "Нема члена чату з таким юзернеймом",
					chat_id: update.message.chat.id,
				}
			})
		} else {
			const userFirebaseFields = querySnapshot.docs[0].data();

			await sendMessage({
			message: {
				chat_id: update.message.chat.id,
				text: `Анкета користувача @${userTag}

1. Ім'я/нікнейм/прізвисько
${userFirebaseFields.name}
2. День народження (вік)
${userFirebaseFields.birthday}
3. Місце проживання
${userFirebaseFields.location}
4. Дізнався(-лась) про Гололайв
${userFirebaseFields.hololiverFrom}
5. Оші
${userFirebaseFields.oshi}
6. Подобається контент
${userFirebaseFields.contentType}
${!!userFirebaseFields.about ? `7. Про себе\n${userFirebaseFields.about}` : ""}`
				}
			});
		}
	} catch (err) {
		console.log(err);
	}

	return ;

}

export default getformCommand;
