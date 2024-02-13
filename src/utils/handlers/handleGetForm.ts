import { kv } from "@vercel/kv";
import { Update, UserFields } from "../types";
import sendMessage from "../sendMessage";

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
	} catch (err) {
		console.log(err);
	}

	return ;
}

export default handleGetForm;
