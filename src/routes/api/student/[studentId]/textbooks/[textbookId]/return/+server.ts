import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTokenData, verifyToken } from '$lib/server/authentication';
import { pool } from '$lib/server/database';
import type { ReturnRequest, TextbookData, TokenData } from '$lib/types';

export const PATCH: RequestHandler = async ({ request, params }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const scanner = getTokenData(request.headers) as TokenData;
	const { status } = (await request.json()) as ReturnRequest;

	await pool.query<TextbookData[]>(
		'INSERT INTO studentTextbooks (studentId, textbookId, returned, scanner) VALUES (?, ?, ?, ?)',
		[params.studentId, params.textbookId, status, scanner.name]
	);

	return json({ success: true });
};
