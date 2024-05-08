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
	Textbook,
	TextbookData
} from '$lib/types';

export const GET: RequestHandler = async ({ request, params }) => {
	if (!verifyToken(request.headers)) {
		return error(403, 'Authentication failed');
	}

	const [studentResults] = await pool.query<StudentData[]>('SELECT * FROM students WHERE id = ?', [
		params.id
	]);

	if (studentResults.length == 0) {
		return error(404, `No student found with ID ${params.id}`);
	}

	const studentData = studentResults[0];
	const courses: Course[] = [];

	const [courseResults] = await pool.query<StudentCourses[]>(
		'SELECT * FROM studentCourses WHERE studentId = ?',
		[params.id]
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

		const [textbookStatusData] = await pool.query<StudentTextbookStatus[]>(
			'SELECT * FROM studentTextbooks WHERE studentId = ? AND textbookId = ?',
			[params.id, textbookData[0].id]
		);

		const textbookStatus: StudentTextbookStatus = textbookStatusData[0] ?? {
			studentId: params.id,
			textbookId: textbookData[0].id,
			returned: false,
			scanner: 'SERVER',
			updateTime: new Date().toString()
		};

		const textbook: Textbook = { status: textbookStatus, ...textbookData[0] };

		const course: Course = { textbook, ...courseData[0] };
		courses.push(course);
	}

	const student: Student = { courses, ...studentData };
	return json(student);
};
