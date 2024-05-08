import { env } from '$env/dynamic/private';
import type { TokenData } from '$lib/types.js';
import { error, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	if (password != env.PASSWORD) {
		error(403, 'Incorrect password');
	}

	const token = jwt.sign({ name } as TokenData, env.JWT_SECRET as string);

	return json({ token: token });
}
