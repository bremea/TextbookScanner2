<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Number from '$lib/components/input/Number.svelte';
	import Error from '$lib/components/misc/Error.svelte';
	import Popup from '$lib/components/misc/Popup.svelte';
	import Cog from 'svelte-material-icons/Cog.svelte';
	import type { StudentData } from '$lib/types';
	import { enhance } from '$app/forms';

	let id = '';
	let lastName = '';
	let error: undefined | string;
	let studentSearchResult: StudentData[] = [];
	let isLookingUp = false;
	let dataPopupOpened = false;

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

{#if dataPopupOpened}
	<Popup close={() => (dataPopupOpened = false)}>
		<div class="w-full h-full flex flex-col items-center justify-center space-y-4">
			<a
				class="text-blue-600 underline hover:no-underline flex items-center"
				href="/api/data/export"
				target="_blank"
			>
				Export all data
			</a>
			<div class="border-black border-t-2 py-4">
				<p class="font-bold">Student CSV Import</p>
				<form
					class="flex w-full justify-between items-center text-sm"
					method="post"
					action="/api/data/import/students"
					use:enhance
					enctype="multipart/form-data"
				>
					<input type="file" id="file" name="fileToUpload" accept=".csv" required />

					<Button class="w-min text-sm">Import</Button>
				</form>
			</div>
			<div class="border-black border-t-2 py-4">
				<p class="font-bold">Textbook CSV Import</p>
				<form
					class="flex w-full justify-between items-center text-sm"
					method="post"
					action="/api/data/import/students"
					use:enhance
					enctype="multipart/form-data"
				>
					<input type="file" id="file" name="fileToUpload" accept=".csv" required />

					<Button class="w-min text-sm">Import</Button>
				</form>
			</div>
		</div>
	</Popup>
{/if}

<div class="flex items-center justify-center h-screen w-screen relative">
	<Button
		class="border-opacity-0 absolute right-6 top-6 w-min"
		onClick={() => (dataPopupOpened = true)}
	>
		<Cog class="w-6 h-6" />
	</Button>
	<div class="w-96 space-y-4">
		<h1 class="font-bold text-2xl">Student Lookup</h1>
		<form on:submit|preventDefault class="w-full space-y-4">
			{#if error != undefined}
				<Error>{error}</Error>
			{/if}
			<Number max={999999} placeholder="Student ID" bind:value={id} />
			<p class="w-full opacity-50 text-center text-sm my-2">or</p>
			<Input placeholder="Student last name" bind:value={lastName} />
			<Button onClick={lookup} loading={isLookingUp} disabled={isLookingUp}>Lookup</Button>
		</form>
	</div>
</div>
