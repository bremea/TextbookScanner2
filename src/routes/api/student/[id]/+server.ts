import { verifyToken } from '$lib/server/authentication.js';
import { pool } from '$lib/server/database.js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RowDataPacket } from 'mysql2/promise';

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const [results] = await pool.query<RowDataPacket[]>('SELECT * FROM students WHERE id = ?', [
		params.id
	]);

	if (results.length == 0) {
		return error(404, `No student found with ID ${params.id}`);
	}

	return json(results[0]);
};
