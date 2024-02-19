import { kv } from "@vercel/kv";
import { Update, UserFields } from "../types";
import sendMessage from "../sendMessage";
import { db } from "@/firebase/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const handleGetForm = async ({update}: {update: Update}) => {
	try {
		if (!update.message.entities
			|| !update.message.text) {
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
		const userFields = await kv.hgetall(`mem:${userTag}`);

		if (update.message.chat.id === Number(process.env.DEV_CHAT_ID)) {
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
		}

		if (!userFields) {
			await sendMessage({
				message: {
					chat_id: update.message.chat.id,
					text: "Нема члена чату з таким юзернеймом",
				}
			});
			return ;
		}

		await sendMessage({
			message: {
				chat_id: update.message.chat.id,
				text: `Анкета користувача @${userTag}

1. Ім'я/нікнейм/прізвисько
${userFields.name}
2. День народження (вік)
${userFields.birthday}
3. Місце проживання
${userFields.location}
4. Дізнався(-лась) про Гололайв
${userFields.hololiverFrom}
5. Оші
${userFields.oshi}
6. Подобається контент
${userFields.contentType}
${!!userFields.freeSpace ? `7. Про себе\n${userFields.freeSpace}` : ""}`
			}
		});

		return ;
	} catch (err) {
		console.log(err);
	}

	return ;
}

export default handleGetForm;
