import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTokenData, verifyToken } from '$lib/server/authentication';
import { pool } from '$lib/server/database';
import type { ReturnRequest, TextbookData, TokenData } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const scanner = getTokenData(request.headers) as TokenData;
	const { barcode, status, studentId } = (await request.json()) as ReturnRequest;

	const [textbookData] = await pool.query<TextbookData[]>(
		'SELECT * FROM textbooks WHERE barcode = ?',
		[barcode]
	);

	if (textbookData.length == 0) {
		return error(404, 'No textbook matches that barcode');
	}

	await pool.query<TextbookData[]>(
		'INSERT INTO studentTextbooks (studentId, textbookId, returned, scanner) VALUES (?, ?, ?, ?)',
		[studentId, textbookData[0].id, status, scanner.name]
	);

	return json({ hi: true });
};
