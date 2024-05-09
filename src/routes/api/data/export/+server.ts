import { getTokenData } from '$lib/server/authentication';
import { pool } from '$lib/server/database';
import type {
	StudentCourses,
	StudentData,
	StudentTextbookStatusData,
	TextbookData,
	TokenData
} from '$lib/types';
import { type RequestHandler } from '@sveltejs/kit';
import exceljs from 'exceljs';
const { Workbook } = exceljs;

export const GET: RequestHandler = async ({ request }) => {
	const user = getTokenData(request.headers) as TokenData;
	const workbook = new Workbook();

	workbook.creator = user.name;
	workbook.lastModifiedBy = user.name;
	workbook.created = new Date();
	workbook.modified = new Date();

	const worksheet = workbook.addWorksheet('Returns');

	worksheet.columns = [
		{ header: 'Last Name', key: 'lastName', width: 32 },
		{ header: 'First Name', key: 'firstName', width: 32 },
		{ header: 'Course', key: 'course', width: 8 },
		{ header: 'Textbook', key: 'textbook', width: 64 },
		{ header: 'Status', key: 'status', width: 16 }
	];

	const [students] = await pool.query<StudentData[]>('SELECT * FROM students');

	for (const student of students) {
		const [courseResults] = await pool.query<StudentCourses[]>(
			'SELECT * FROM studentCourses WHERE studentId = ?',
			[student.id]
		);

		for (const studentCourse of courseResults) {
			const [textbookData] = await pool.query<TextbookData[]>(
				'SELECT * FROM textbooks WHERE course = ?',
				[studentCourse.courseId]
			);

			if (textbookData.length == 0) break;

			for (const textbook of textbookData) {
				const [textbookStatus] = await pool.query<StudentTextbookStatusData[]>(
					'SELECT * FROM studentTextbooks WHERE studentId = ? AND textbookId = ? ORDER BY updateTime DESC LIMIT 1',
					[student.id, textbook.id]
				);

				worksheet.addRow({
					lastName: student.lastName,
					firstName: student.firstName,
					course: studentCourse.courseId,
					textbook: textbook.name,
					status: textbookStatus[0].returned == 1 ? 'Returned' : 'Not returned'
				});
			}
		}
	}

	const buffer = await workbook.xlsx.writeBuffer();

	return new Response(buffer, {
		headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
	});
};
