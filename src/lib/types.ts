export interface StudentData {
	firstName: string;
	lastName: string;
	id: string;
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
