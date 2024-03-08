import { UserForm } from "@/utils/types";
import insertMemFormVP from "../vercel-postgres/insertMemFormVP";
import sendMessage from "@/utils/sendMessage";

const insertMemForm = async ({ userForm }: { userForm: UserForm }) => {
	try {
		await insertMemFormVP({ userForm: userForm });
	} catch (err) {
		await sendMessage({
			message: {
				text: `${userForm.tgTag} має проблеми із записом форми до датабази`,
				chat_id: Number(process.env.DEV_CHAT_ID),
			}
		});
		console.log(err);
	};

	return;
}

export default insertMemForm;
