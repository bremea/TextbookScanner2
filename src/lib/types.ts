import type { RowDataPacket } from 'mysql2';

export interface StudentData extends RowDataPacket {
	firstName: string;
	lastName: string;
	id: string;
}

export interface Student extends StudentData {
	courses: Course[];
}

export interface Course extends CourseData {
	textbook?: TextbookData;
}

export interface Textbook extends TextbookData {
	status: StudentTextbookStatus;
}

export interface TextbookData extends RowDataPacket {
	id: number;
	name: string;
	isbn13?: number;
	barcode?: number;
	course: number;
}

export interface CourseData extends RowDataPacket {
	id: number;
	name: string;
}

export interface StudentCourses extends RowDataPacket {
	studentId: number;
	courseId: number;
}

export interface StudentTextbookStatus extends RowDataPacket {
	studentId: number;
	textbookId: number;
	returned: boolean;
	scanner: string;
	updateTime: string;
}

export interface TokenData {
	name: string;
}

export interface MiddlewareError {
	code: number;
	message: string;
}

export type LookupRequest = LookupRequestId | LookupRequestLastName;

type LookupRequestLastName = {
	lastName: string;
};

type LookupRequestId = {
	id: number;
};

export interface StudentLookupResult {
	studentFound: boolean;
	id: number;
}
