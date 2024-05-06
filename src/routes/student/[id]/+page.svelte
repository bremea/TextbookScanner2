<script lang="ts">
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import type { StudentData } from '$lib/types';
	import Check from 'svelte-material-icons/Check.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let data: StudentData;
</script>

<div class="flex items-center justify-center h-screen w-screen">
	<div class="space-y-4">
		<h1 class="font-bold text-2xl">Brett Meadows</h1>
		<p>ID: {data.id}</p>
		<div class="py-2 px-4 w-full bg-red-100 flex">
			<span class="font-bold text-red-500 flex items-center mr-1">
				<Close class="h-6 w-6 mr-2" /><span>Error:</span>
			</span>
			Textbook not found. Is the barcode correct?
		</div>
		<div class="py-2 px-4 w-full bg-green-100 flex">
			<span class="font-bold text-green-600 flex items-center mr-1">
				<Check class="h-6 w-6 mr-2" /><span>Returned:</span>
			</span>
			<span class="mx-1">AP United States Government Textbook</span>
		</div>
		<div class="flex space-x-2">
			<Input placeholder="Textbook barcode..." />
			<Button class="w-min">Return</Button>
		</div>
		<table class="w-[900px]">
			<tr class="border-gray-500 border-b">
				<th class="text-left px-4 py-2">Title</th>
				<th class="text-left px-4 py-2">Course</th>
				<th class="text-left px-4 py-2">Status</th>
			</tr>
			<tr class="border-gray-500 border-b bg-red-100">
				<td class="text-left px-4 py-2">
					<a class="text-blue-600 underline hover:no-underline" href="/textbooks/abc123"
						>AP Stat 101 Textbook</a
					></td
				>
				<td class="text-left px-4 py-2">251-02</td>
				<td class="text-left px-4 py-2"
					><span class="font-bold text-red-500 flex items-center"
						><Close class="h-6 w-6 mr-2" />Not returned</span
					></td
				>
			</tr>
			<tr class="border-gray-500 border-b">
				<td class="text-left px-4 py-2"
					><a class="text-blue-600 underline hover:no-underline" href="/textbooks/abc123"
						>AP United States Government Textbook</a
					></td
				>
				<td class="text-left px-4 py-2">445-01</td>
				<td class="text-left px-4 py-2"
					><span class="font-bold text-green-600 flex items-center"
						><Check class="h-6 w-6 mr-2" />Returned</span
					></td
				>
			</tr>
		</table>
	</div>
</div>
