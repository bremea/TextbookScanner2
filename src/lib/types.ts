export interface StudentData {
	firstName: string;
	lastName: string;
	id: string;
}

export interface Student extends StudentData {
	courses: Course[];
}

export interface Course extends CourseData {
	textbook: TextbookData;
}

export interface TextbookData {
	id: number;
	name: string;
	isbn13?: number;
	barcode?: number;
	course: number;
}

export interface CourseData {
	id: number;
	name: string;
}

export interface StudentCourses {
	studentId: number;
	courseId: number;
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
