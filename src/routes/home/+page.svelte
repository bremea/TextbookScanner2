<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Number from '$lib/components/input/Number.svelte';
	import Password from '$lib/components/input/Password.svelte';
	import Error from '$lib/components/misc/Error.svelte';

	let id = '';
	let lastName = '';
	let error: undefined | string;

	const lookup = async () => {
		const req = await fetch('/api/lookup', {
			method: 'POST',
			body: JSON.stringify({ id })
		});

		if (req.status == 200) {
			// handle response
		} else {
			error = (await req.json()).message;
		}
	};
</script>

<div class="flex items-center justify-center h-screen w-screen">
	<div class="w-96 space-y-4">
		<h1 class="font-bold text-2xl">Student Lookup</h1>
		{#if error != undefined}
			<Error>{error}</Error>
		{/if}
		<Number max={999999} placeholder="Student ID" bind:value={id} />
		<p class="w-full opacity-50 text-center text-sm my-2">or</p>
		<Input placeholder="Student last name" bind:value={lastName} />
		<Button>Lookup</Button>
	</div>
</div>
