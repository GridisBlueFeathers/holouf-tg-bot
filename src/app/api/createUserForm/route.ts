import insertMemForm from "@/utils/db/interfaces/insertMemForm";
import sendMessage from "@/utils/sendMessage";
import { UserForm } from "@/utils/types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const userForm = await request.json() as UserForm;

		insertMemForm({ userForm: userForm });

		await sendMessage({
			message: {
				chat_id: Number(process.env.DEV_CHAT_ID),
				text: `Нова анкета користувача ${userForm.tgTag}

1. Ім'я/нікнейм/прізвисько
${userForm.name}
2. День народження (вік)
${userForm.birthday}
3. Місце проживання
${userForm.location}
4. Дізнався(-лась) про Гололайв
${userForm.hololiverFrom}
5. Оші
${userForm.oshi}
6. Подобається контент
${userForm.content}
${!!userForm.about ? `7. Про себе\n${userForm.about}` : ""}`
			}
		});
	} catch (err) {
		console.log(err);
	};

	return new Response("OK");
}
