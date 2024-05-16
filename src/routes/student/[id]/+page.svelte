<script lang="ts">
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Popup from '$lib/components/misc/Popup.svelte';
	import Error from '$lib/components/misc/Error.svelte';
	import type { Student, StudentTextbookStatus, Textbook } from '$lib/types';
	import Check from 'svelte-material-icons/Check.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import ArrowLeft from 'svelte-material-icons/ArrowLeft.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Loader from '$lib/components/misc/Loader.svelte';

	export let data: { id: string };
	export let student: Student;

	let error: string | undefined;
	let loading = true;
	let loadingTextbook = false;
	let waitingForNewStatus = false;
	let selectedTextbook: Textbook | undefined;
	let selectedTextbookStatuses: StudentTextbookStatus[] = [];
	let barcode: string = '';
	let barcodeEntry: HTMLInputElement;

	const updateSelected = () => {
		const status = selectedTextbook!.status.returned;
		updateStatus(selectedTextbook!.id, !status);
	};

	const fetchReturnLog = async (id: number): Promise<boolean> => {
		const req = await fetch(
			`/api/student/${student.id}/textbooks/${id}/log?studentId=${student.id}`,
			{
				headers: { Authorization: localStorage.getItem('token')! }
			}
		);

		if (req.status == 200) {
			selectedTextbookStatuses = await req.json();
			return true;
		} else {
			error = await req.text();
			return false;
		}
	};

	const openTextbookDetails = async (textbook: Textbook) => {
		loadingTextbook = true;
		selectedTextbook = textbook;

		await fetchReturnLog(textbook.id);
		loadingTextbook = false;
	};

	const refreshData = async () => {
		const req = await fetch(`/api/student/${data.id}`, {
			headers: { Authorization: localStorage.getItem('token')! }
		});

		if (req.status == 200) {
			student = await req.json();
			waitingForNewStatus = false;
			selectedTextbook = undefined;
			loading = false;
		} else {
			error = (await req.json()).message;
			selectedTextbook = undefined;
			waitingForNewStatus = false;
		}
	};

	const updateStatus = async (id: number, status: boolean) => {
		waitingForNewStatus = true;
		const req = await fetch(`/api/student/${student.id}/textbooks/${id}/return`, {
			method: 'PATCH',
			body: JSON.stringify({ studentId: student.id, status }),
			headers: { Authorization: localStorage.getItem('token')! }
		});

		if (req.status == 200) {
			refreshData();
		} else {
			waitingForNewStatus = false;
			error = (await req.json()).message;
		}
	};

	const fetchTextbook = async () => {
		waitingForNewStatus = true;
		const req = await fetch(`/api/student/${student.id}/textbooks/lookup?barcode=${barcode}`, {
			method: 'GET',
			headers: { Authorization: localStorage.getItem('token')! }
		});

		barcode = '';

		if (req.status == 200) {
			const textbook = (await req.json()) as Textbook;
			updateStatus(textbook.id, !textbook.status.returned);
		} else {
			error = (await req.json()).message;
			waitingForNewStatus = false;
		}
	};

	const processBarcodeInput = () => {
		if (barcode.length >= 13) {
			barcode = barcode.substring(0, 13);
			fetchTextbook();
		}
	};

	onMount(refreshData);
</script>

{#if loading}
	<div class="w-screen h-screen flex items-center justify-center">
		<Loader />
	</div>
{:else}
	{#if selectedTextbook}
		<Popup close={() => (selectedTextbook = undefined)}>
			<div class="space-y-4">
				<h1 class="font-bold text-2xl mb-2">
					{selectedTextbook.name}
				</h1>

				<div class={`w-full ${selectedTextbook.status.returned ? 'bg-green-100' : 'bg-red-100'}`}>
					{#if selectedTextbook.status.returned}
						<span
							class="font-bold text-green-600 flex items-center justify-center text-center text-3xl"
						>
							<Check class="h-12 w-12 mr-2" />Returned
						</span>
					{:else}
						<span
							class="font-bold text-red-500 flex items-center justify-center text-center text-3xl"
						>
							<Close class="h-12 w-12 mr-2" />Not returned
						</span>
					{/if}
				</div>

				<div class="my-4 w-full flex items-center justify-center">
					<p class="w-2/3">
						This textbook is for course <span class="font-bold">{selectedTextbook.course}</span>. It
						was last marked as
						<span class="font-bold"
							>{selectedTextbook.status.returned ? 'returned' : 'not returned'}</span
						>
						on
						<span class="font-bold"
							>{new Date(selectedTextbook.status.updateTime).toLocaleString()}</span
						>
						by
						<span class="font-bold">{selectedTextbook.status.scanner}</span>.
					</p>
				</div>

				<p class="text-sm">
					ISBN: {selectedTextbook.isbn13}<br />
					Barcode: {selectedTextbook.barcode}
				</p>

				<div class="my-4 w-full flex items-center justify-center">
					<Button class="flex justify-center w-2/3" onClick={updateSelected}>
						<span class="mr-0.5">Manually mark as</span>
						{#if selectedTextbook.status.returned}
							<span class="font-bold text-red-500 flex items-center justify-center text-center">
								<Close class="h-6 w-6 mr-0.5" />Not returned
							</span>
						{:else}
							<span class="font-bold text-green-600 flex items-center justify-center text-center">
								<Check class="h-6 w-6 mr-0.5" />Returned
							</span>
						{/if}
					</Button>
				</div>

				{#if loadingTextbook}
					<div class="w-full h-64 flex items-center justify-center">
						<Loader />
					</div>
				{:else}
					<div class="h-64 w-full overflow-auto">
						<table class="w-full">
							<tr class="border-gray-500 border-b">
								<th class="text-left px-4 py-2">Action</th>
								<th class="text-left px-4 py-2">Scanner</th>
								<th class="text-left px-4 py-2">Time</th>
							</tr>
							{#each selectedTextbookStatuses as status}
								<tr class="border-gray-500 border-b">
									<td class="text-left px-4 py-2">
										Marked as
										<span class="font-bold">
											{status.returned ? 'returned' : 'not returned'}
										</span>
									</td>
									<td class="text-left px-4 py-2">{status.scanner}</td>
									<td class="text-left px-4 py-2">{new Date(status.updateTime).toLocaleString()}</td
									>
								</tr>
							{/each}
						</table>
					</div>
				{/if}
			</div>
		</Popup>
	{/if}

	<div class="flex items-center justify-center h-screen w-screen">
		<div class="space-y-4">
			<a
				class="text-blue-600 underline hover:no-underline flex items-center"
				href="/home"
				on:click={() => goto('/home')}
			>
				<ArrowLeft class="mr-1" />Go back
			</a>
			<h1 class="font-bold text-2xl">{student.firstName} {student.lastName}</h1>
			<p>ID: {student.id}<br />HR: {student.homeroom}</p>
			{#if error != undefined}
				<Error>{error}</Error>
			{/if}
			<form on:submit|preventDefault class="flex items-center">
				<Input
					placeholder="Enter barcode..."
					bindTo={barcodeEntry}
					autofocus
					onInput={processBarcodeInput}
					bind:value={barcode}
				/>
				<Button class="w-min ml-2" loading={waitingForNewStatus} disabled={waitingForNewStatus}
					>Go</Button
				>
			</form>
			<table class="w-[900px]">
				<tr class="border-gray-500 border-b">
					<th class="text-left px-4 py-2">Title</th>
					<th class="text-left px-4 py-2">Course</th>
					<th class="text-left px-4 py-2">Status</th>
				</tr>
				{#each student.courses as course}
					{#each course.textbooks as textbook}
						<tr class={`border-gray-500 border-b ${textbook.status.returned ? '' : 'bg-red-100'}`}>
							<td class="text-left px-4 py-2">
								<a
									class="text-blue-600 underline hover:no-underline"
									href="#info"
									on:click={() => openTextbookDetails(textbook)}
								>
									{textbook.name}
								</a>
							</td>
							<td class="text-left px-4 py-2">{course.id}</td>
							<td class="text-left px-4 py-2">
								{#if textbook.status.returned}
									<span class="font-bold text-green-600 flex items-center">
										<Check class="h-6 w-6 mr-2" />Returned
									</span>
								{:else}
									<span class="font-bold text-red-500 flex items-center">
										<Close class="h-6 w-6 mr-2" />Not returned
									</span>
								{/if}
							</td>
						</tr>
					{/each}
				{/each}
			</table>
		</div>
	</div>
{/if}
