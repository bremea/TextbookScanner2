import type { StudentData } from '$lib/types.js';

export const load = ({ params }): StudentData => {
	return {
		firstName: "Brett",
		lastName: "Meadows",
		id: params.id
	};
};
