<script lang="ts">
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Popup from '$lib/components/misc/Popup.svelte';
	import type { Student, Textbook } from '$lib/types';
	import Check from 'svelte-material-icons/Check.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let data: Student;

	let selectedTextbook: Textbook | undefined;
</script>

{#if selectedTextbook}
	<Popup close={() => (selectedTextbook = undefined)}>
		<div class="space-y-4">
			<h1 class="font-bold text-2xl mb-2">
				{selectedTextbook.name}
			</h1>

			<div
				class={`w-full ${selectedTextbook.status[selectedTextbook.status.length - 1].returned ? 'bg-green-100' : 'bg-red-100'}`}
			>
				{#if selectedTextbook.status[selectedTextbook.status.length - 1].returned}
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
				<p class="w-[400px]">
					This textbook is for course <span class="font-bold">{selectedTextbook.course}</span>. It
					was last marked as
					<span class="font-bold"
						>{selectedTextbook.status[selectedTextbook.status.length - 1].returned
							? 'returned'
							: 'not returned'}</span
					>
					on
					<span class="font-bold"
						>{new Date(
							selectedTextbook.status[selectedTextbook.status.length - 1].updateTime
						).toLocaleString()}</span
					>
					by
					<span class="font-bold"
						>{selectedTextbook.status[selectedTextbook.status.length - 1].scanner}</span
					>.
				</p>
			</div>

			<p class="text-sm">
				ISBN: {selectedTextbook.isbn13}<br />
				Barcode: {selectedTextbook.barcode}
			</p>

			<div class="my-4 w-full flex items-center justify-center">
				<Button class="flex justify-center w-[400px]">
					<span class="mr-0.5">Manually mark as</span>
					{#if selectedTextbook.status[selectedTextbook.status.length - 1].returned}
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

			<table class="w-[900px]">
				<tr class="border-gray-500 border-b">
					<th class="text-left px-4 py-2">Action</th>
					<th class="text-left px-4 py-2">Scanner</th>
					<th class="text-left px-4 py-2">Time</th>
				</tr>
				{#each selectedTextbook.status.reverse() as status}
					<tr class="border-gray-500 border-b">
						<td class="text-left px-4 py-2"
							>Marked as <span class="font-bold"
								>{status.returned ? 'returned' : 'not returned'}</span
							></td
						>
						<td class="text-left px-4 py-2">{status.scanner}</td>
						<td class="text-left px-4 py-2">{new Date(status.updateTime).toLocaleString()}</td>
					</tr>
				{/each}
			</table>
		</div>
	</Popup>
{/if}

<div class="flex items-center justify-center h-screen w-screen">
	<div class="space-y-4">
		<h1 class="font-bold text-2xl">{data.firstName} {data.lastName}</h1>
		<p>ID: {data.id}</p>
		<div class="flex space-x-2">
			<Input placeholder="Textbook barcode..." />
			<Button class="w-min">Update</Button>
		</div>
		<table class="w-[900px]">
			<tr class="border-gray-500 border-b">
				<th class="text-left px-4 py-2">Title</th>
				<th class="text-left px-4 py-2">Course</th>
				<th class="text-left px-4 py-2">Status</th>
			</tr>
			{#each data.courses as course}
				{#each course.textbooks as textbook}
					<tr
						class={`border-gray-500 border-b ${textbook.status[textbook.status.length - 1].returned ? '' : 'bg-red-100'}`}
					>
						<td class="text-left px-4 py-2">
							<a
								class="text-blue-600 underline hover:no-underline"
								href="#info"
								on:click={() => {
									selectedTextbook = textbook;
									console.log(
										selectedTextbook.status[selectedTextbook.status.length - 1].updateTime
									);
								}}
							>
								{textbook.name}
							</a>
						</td>
						<td class="text-left px-4 py-2">{course.id}</td>
						<td class="text-left px-4 py-2">
							{#if textbook.status[textbook.status.length - 1].returned}
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
