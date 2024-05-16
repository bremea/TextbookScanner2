import { pool } from '$lib/server/database';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { parse } from 'csv-parse';

export const POST: RequestHandler = async ({ request }) => {
	const formData = Object.fromEntries(await request.formData());

	if (
		!(formData.fileToUpload as File).name ||
		(formData.fileToUpload as File).name === 'undefined'
	) {
		return error(400, 'You must provide a file to upload');
	}

	const { fileToUpload } = formData as { fileToUpload: File };

	const parser = parse(await fileToUpload.text());
	for await (const record of parser) {
		const reformatted = record
			.join(',')
			.replace(/[\u200B-\u200D\uFEFF]/g, '')
			.split(',');

		if (reformatted.length < 3) {
			return error(400, 'Invalid CSV format');
		}
		await pool.query(
			'INSERT IGNORE INTO textbooks (name, isbn13, barcode, course) VALUES (?, ?, ?, ?)',
			[reformatted[1], reformatted[2], reformatted[2], reformatted[0]]
		);
	}

	return json({ hi: true });
};
