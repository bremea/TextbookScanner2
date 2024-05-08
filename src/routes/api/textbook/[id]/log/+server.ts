import { verifyToken } from '$lib/server/authentication.js';
import { pool } from '$lib/server/database.js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { StudentTextbookStatusData } from '$lib/types';

export const GET: RequestHandler = async ({ request, params, url }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const studentId = url.searchParams.get('studentId');
	if (!studentId) {
		return error(400, 'Missing student ID');
	}

	const [textbookStatusData] = await pool.query<StudentTextbookStatusData[]>(
		'SELECT * FROM studentTextbooks WHERE studentId = ? AND textbookId = ? ORDER BY updateTime DESC',
		[studentId, params.id]
	);

	return json(textbookStatusData);
};
