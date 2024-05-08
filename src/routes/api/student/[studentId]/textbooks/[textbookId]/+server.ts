import { verifyToken } from '$lib/server/authentication.js';
import { pool } from '$lib/server/database.js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type {
	StudentTextbookStatus,
	StudentTextbookStatusData,
	Textbook,
	TextbookData
} from '$lib/types';

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const [textbookData] = await pool.query<TextbookData[]>('SELECT * FROM textbooks WHERE id = ?', [
		params.textbookId
	]);

	const [textbookStatusData] = await pool.query<StudentTextbookStatusData[]>(
		'SELECT * FROM studentTextbooks WHERE studentId = ? AND textbookId = ? ORDER BY updateTime DESC',
		[params.studentId, params.textbookId]
	);

	const textbookStatus: StudentTextbookStatusData =
		textbookStatusData.length > 0
			? textbookStatusData[0]
			: ({
					studentId: parseInt(params.studentId),
					textbookId: textbookData[0].id,
					returned: 0,
					scanner: 'SERVER',
					updateTime: new Date().toString()
				} as StudentTextbookStatusData);

	const fixedStatus: StudentTextbookStatus = {
		...textbookStatus,
		returned: textbookStatus.returned == 1
	};

	const textbook: Textbook = { status: fixedStatus, ...textbookData[0] };

	return json(textbook);
};
