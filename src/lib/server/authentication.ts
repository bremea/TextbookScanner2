import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import type { MiddlewareError, TokenData } from '$lib/types';

export const getTokenData = (headers: Headers): MiddlewareError | TokenData => {
	if (!headers.get('Authorization')) {
		return {
			code: 403,
			message: 'Missing token'
		};
	}

	try {
		return jwt.verify(headers.get('Authorization')!, env.JWT_SECRET as string) as TokenData;
	} catch (e) {
		return {
			code: 403,
			message: 'Authentication failed'
		};
	}
};

export const verifyToken = (headers: Headers): boolean => {
	if (!headers.get('Authorization')) {
		return false;
	}

	try {
		return true;
	} catch (e) {
		return false;
	}
};
