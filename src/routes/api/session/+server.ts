import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { name, password } = await request.json();

	if (password != env.PASSWORD) {
		error(403, 'Incorrect password');
	}

	const token = jwt.sign({ name }, env.JWT_SECRET as string);

	return json({ token: token });
}
