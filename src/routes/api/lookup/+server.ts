import { verifyToken } from '$lib/server/authentication.js';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	return json({ studentFound: true, id: 243780 });
}
