import type { StudentData } from '$lib/types.js';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ params }): Promise<StudentData> => {
	const req = await fetch(`/api/student/${params.id}`, {
		headers: { Authentication: localStorage.getItem('token')! }
	});

	if (req.status == 200) {
		const data = (await req.json()) as StudentData;

		return data;
	} else {
		error(req.status, await req.text());
	}
};
