import sendMessage from "@/utils/sendMessage";
import { UserFields } from "@/utils/types";
import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {

		const userFields = await request.json() as UserFields;

		await kv.hset(`mem:${userFields.tag.slice(1, userFields.tag.length)}`, {
			name: userFields.name,
			birthday: userFields.birthday,
			location: userFields.location,
			hololiverFrom: userFields.hololiverFrom,
			oshi: userFields.oshi,
			contentType: userFields.contentType,
			freeSpace: userFields.freeSpace,
		})

		await sendMessage({
			message: {
				chat_id: Number(process.env.ADMIN_CHAT_ID),
				text: `Анкета користувача ${userFields.tag}

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
		})

		return new Response("OK");
	} catch (err) {
		console.log(err);
	}

	return new Response("OK");
}
