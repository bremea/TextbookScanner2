import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: env.DB_PASSWORD,
	database: 'textbooks',
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10,
	idleTimeout: 60000,
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0
});
