import { verifyToken } from '$lib/server/authentication.js';
import { pool } from '$lib/server/database.js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RowDataPacket } from 'mysql2/promise';

export const GET: RequestHandler = async ({ request, url }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const id = url.searchParams.get('id');
	const lastName = url.searchParams.get('lastName');

	if (id) {
		const [results] = await pool.query<RowDataPacket[]>('SELECT * FROM students WHERE id = ?', [
			id
		]);

		if (results.length == 0) {
			return error(404, `No student found with ID ${id}`);
		} else {
			return json(results);
		}
	} else {
		if (!lastName) {
			return error(400, 'Missing id or last name');
		}

		const [results] = await pool.query<RowDataPacket[]>(
			'SELECT * FROM students WHERE LOWER(lastName) = LOWER(?)',
			[lastName]
		);

		if (results.length == 0) {
			return error(404, `No student found with last name "${lastName}"`);
		} else {
			return json(results);
		}
	}
};
