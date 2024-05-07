<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Password from '$lib/components/input/Password.svelte';
	import Error from '$lib/components/misc/Error.svelte';

	let name = "";
	let password = "";
	let error: undefined | string;

	const login = async () => {
		const req = await fetch('/api/session', {
			method: 'POST',
			body: JSON.stringify({ name, password })
		});

		if (req.status == 200) {
			localStorage.setItem('token', (await req.json()).token);
			goto('/home');
		} else {
			error = (await req.json()).message;
		}
	};
</script>

<div class="flex items-center justify-center h-screen w-screen">
	<div class="w-96 space-y-4">
		<h1 class="font-bold text-2xl">Login</h1>
		{#if error != undefined}
			<Error>{error}</Error>
		{/if}
		<Input bind:value={name} placeholder="Your Name" autocomplete="name" />
		<Password bind:value={password} />
		<Button onClick={login}>Login</Button>
	</div>
</div>
