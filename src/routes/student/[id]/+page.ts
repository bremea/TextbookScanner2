import type { Student } from '$lib/types.js';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ params }): Promise<Student> => {
	const req = await fetch(`/api/student/${params.id}`, {
		headers: { Authorization: localStorage.getItem('token')! }
	});

	if (req.status == 200) {
		const data = (await req.json()) as Student;

		return data;
	} else {
		error(req.status, await req.text());
	}
};
