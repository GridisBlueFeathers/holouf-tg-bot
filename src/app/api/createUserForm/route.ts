import { db } from "@/firebase/firebase";
import sendMessage from "@/utils/sendMessage";
import { UserFields } from "@/utils/types";
import { kv } from "@vercel/kv";
import { collection, getDocs, limit, query, setDoc, where } from "firebase/firestore";
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

		const membersRef = collection(db, "members");
		const q = query(membersRef, where("tgTag", "==", userFields.tag.slice(1, userFields.tag.length)), limit(1));

		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			await sendMessage({
				message: {
					text: `Скажіть будь ласка ${userFields.tag} зробити /start чи /apply у боті`,
					chat_id: Number(process.env.ADMIN_CHAT_ID),
				}
			});
			return new Response("OK");
		} else {
			const userDocumentRef = querySnapshot.docs[0].ref;
			const userDocumentData = querySnapshot.docs[0].data();

			await setDoc(userDocumentRef, {
				...userDocumentData,
				name: userFields.name,
				birthday: userFields.birthday,
				location: userFields.location,
				hololiverFrom: userFields.hololiverFrom,
				oshi: userFields.oshi,
				content: userFields.contentType,
				about: userFields.freeSpace,
			});
		}

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
