<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Number from '$lib/components/input/Number.svelte';
	import Password from '$lib/components/input/Password.svelte';
	import Error from '$lib/components/misc/Error.svelte';

	let name = '';
	let password = '';
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
		<h1 class="font-bold text-2xl">Student Lookup</h1>
		<div class="space-y-2">
			<div class="flex space-x-2">
				<Number max={999999} placeholder="Student ID" />
				<Button class="w-min">Lookup</Button>
			</div>
		</div>
		<p class="w-full opacity-50 text-center text-sm my-8">or</p>
		<div class="space-y-2">
			<div class="flex space-x-2">
				<Input placeholder="Student last name" />
				<Button class="w-min">Lookup</Button>
			</div>
		</div>
	</div>
</div>
