<script lang="ts">
	import EyeOff from 'svelte-material-icons/EyeOff.svelte';
	import Eye from 'svelte-material-icons/Eye.svelte';

	let showingPassword = false;
	$: type = showingPassword ? 'text' : 'password';

	export let placeholder = 'Password';
	let bindValue: string = '';
	export let autocomplete: string = '';
	export { bindValue as value };

	function onInput(event: any) {
		bindValue = event.target.value;
	}

	const togglePasswordVisibility = () => {
		showingPassword = !showingPassword;
	};
</script>

<div class="relative">
	<input
		class="border-2 py-2 px-4 w-full border-black pr-12"
		{placeholder}
		{type}
		{autocomplete}
		value={bindValue}
		on:input={onInput}
	/>
	{#if showingPassword}
		<button class="absolute right-2.5 top-2.5 w-6 h-6 z-10 p-0" on:click={togglePasswordVisibility}>
			<EyeOff class="w-full h-full" />
		</button>
	{:else}
		<button class="absolute right-2.5 top-2.5 w-6 h-6 z-10 p-0" on:click={togglePasswordVisibility}>
			<Eye class="w-full h-full" />
		</button>
	{/if}
</div>
