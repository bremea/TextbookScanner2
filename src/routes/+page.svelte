<script>
	import Button from '$lib/components/input/Button.svelte';
	import Input from '$lib/components/input/Input.svelte';
	import Password from '$lib/components/input/Password.svelte';
</script>

<div class="flex items-center justify-center h-screen w-screen">
	<div class="w-96 space-y-4">
		<h1 class="font-bold text-2xl">Login</h1>
		<Input placeholder="Your Name" autocomplete="name" />
		<Password />
		<Button>Login</Button>
	</div>
</div>
