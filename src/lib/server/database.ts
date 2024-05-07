import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: env.DB_PASSWORD
});
