import { verifyToken } from '$lib/server/authentication.js';
import { pool } from '$lib/server/database.js';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type {
	Course,
	CourseData,
	Student,
	StudentCourses,
	StudentData,
	StudentTextbookStatus,
	StudentTextbookStatusData,
	Textbook,
	TextbookData
} from '$lib/types';

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const [studentResults] = await pool.query<StudentData[]>('SELECT * FROM students WHERE id = ?', [
		params.studentId
	]);

	if (studentResults.length == 0) {
		return error(404, `No student found with ID ${params.studentId}`);
	}

	const studentData = studentResults[0];
	const courses: Course[] = [];

	const [courseResults] = await pool.query<StudentCourses[]>(
		'SELECT * FROM studentCourses WHERE studentId = ?',
		[params.studentId]
	);

	for (const studentCourse of courseResults) {
		const [courseData] = await pool.query<CourseData[]>('SELECT * FROM courses WHERE id = ?', [
			studentCourse.courseId
		]);

		if (courseData.length == 0) break;

		const [textbookData] = await pool.query<TextbookData[]>(
			'SELECT * FROM textbooks WHERE course = ?',
			[studentCourse.courseId]
		);

		if (textbookData.length == 0) break;

		const textbooks: Textbook[] = [];

		for (const individualTextbookData of textbookData) {
			const [textbookStatusData] = await pool.query<StudentTextbookStatusData[]>(
				'SELECT * FROM studentTextbooks WHERE studentId = ? AND textbookId = ? ORDER BY updateTime DESC',
				[params.studentId, individualTextbookData.id]
			);

			const textbookStatus: StudentTextbookStatusData =
				textbookStatusData.length > 0
					? textbookStatusData[0]
					: ({
							studentId: parseInt(params.studentId),
							textbookId: individualTextbookData.id,
							returned: 0,
							scanner: 'SERVER',
							updateTime: new Date().toString()
						} as StudentTextbookStatusData);

			const fixedStatus: StudentTextbookStatus = {
				...textbookStatus,
				returned: textbookStatus.returned == 1
			};

			textbooks.push({ status: fixedStatus, ...individualTextbookData });
		}

		const course: Course = { textbooks, ...courseData[0] };
		courses.push(course);
	}

	const student: Student = { courses, ...studentData };
	return json(student);
};
