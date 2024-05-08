<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Number from '$lib/components/input/Number.svelte';
	import Error from '$lib/components/misc/Error.svelte';
	import Popup from '$lib/components/misc/Popup.svelte';
	import type { StudentData } from '$lib/types';

	let id = '';
	let lastName = '';
	let error: undefined | string;
	let studentSearchResult: StudentData[] = [];
	let isLookingUp = false;

	const lookup = async () => {
		isLookingUp = true;

		let url = '/api/student/lookup?id=' + id;
		if (id == null || id == undefined || id.length == 0) {
			url = '/api/student/lookup?lastName=' + lastName;
		}

		const req = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: localStorage.getItem('token')!
			}
		});

		if (req.status == 200) {
			isLookingUp = false;
			const data = (await req.json()) as StudentData[];

			if (data.length == 0) {
				error = 'No students found';
			} else if (data.length == 1) {
				goto(`/student/${data[0].id}`);
			} else {
				studentSearchResult = data;
			}
		} else {
			isLookingUp = false;
			error = (await req.json()).message;
		}
	};
</script>

{#if studentSearchResult.length > 1}
	<Popup close={() => (studentSearchResult = [])}>
		<div>
			<h1 class="font-bold text-2xl mb-2">Select Student</h1>
			<div class="space-y-2">
				{#each studentSearchResult as student}
					<Button
						onClick={() => {
							goto(`/student/${student.id}`);
						}}>{student.firstName} {student.lastName} ({student.id})</Button
					>
				{/each}
			</div>
		</div>
	</Popup>
{/if}

<div class="flex items-center justify-center h-screen w-screen">
	<div class="w-96 space-y-4">
		<h1 class="font-bold text-2xl">Student Lookup</h1>
		{#if error != undefined}
			<Error>{error}</Error>
		{/if}
		<Number max={999999} placeholder="Student ID" bind:value={id} />
		<p class="w-full opacity-50 text-center text-sm my-2">or</p>
		<Input placeholder="Student last name" bind:value={lastName} />
		<Button onClick={lookup} loading={isLookingUp} disabled={isLookingUp}>Lookup</Button>
	</div>
</div>
