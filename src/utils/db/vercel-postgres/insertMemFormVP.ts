import { UserForm } from "@/utils/types";
import { sql } from "@vercel/postgres";

const insertMemFormVP = async ({ userForm }: { userForm: UserForm }) => {
	await sql`DELETE FROM mem_forms
		WHERE tg_tag = ${userForm.tgTag};`;

	await sql`INSERT INTO mem_forms (
			tg_tag,
			name,
			birthday,
			location,
			hololiver_from,
			oshi,
			content,
			about
		)
		VALUES (
			${userForm.tgTag},
			${userForm.name},
			${userForm.birthday},
			${userForm.location},
			${userForm.hololiverFrom},
			${userForm.oshi},
			${userForm.content},
			${userForm.about}
		);`;

	return;
}

export default insertMemFormVP;
