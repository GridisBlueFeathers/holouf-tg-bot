import { sql } from "@vercel/postgres";

export async function GET() {
	const yo = {
		yo: "yo"
	}

	try {
		await sql`INSERT INTO test_table (
			name
		)
		VALUES (
			''
		);`
	} catch (err) {
		console.log(err);
	}

	return new Response("OK");
}
