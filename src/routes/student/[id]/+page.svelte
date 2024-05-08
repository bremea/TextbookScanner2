<script lang="ts">
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import type { Student } from '$lib/types';
	import Check from 'svelte-material-icons/Check.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	export let data: Student;
</script>

<div class="flex items-center justify-center h-screen w-screen">
	<div class="space-y-4">
		<h1 class="font-bold text-2xl">{data.firstName} {data.lastName}</h1>
		<p>ID: {data.id}</p>
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
			{#each data.courses as course}
				{#each course.textbooks as textbook}
					<tr class={`border-gray-500 border-b ${textbook.status.returned ? '' : 'bg-red-100'}`}>
						<td class="text-left px-4 py-2">
							<a class="text-blue-600 underline hover:no-underline" href="/textbooks/abc123">
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
