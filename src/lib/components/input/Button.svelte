<script lang="ts">
	import Loader from '../misc/Loader.svelte';

	export let onClick = () => {};
	export let loading = false;
	export let disabled = false;
	if (loading) disabled = true;
	let classAddon: string = "";
	export { classAddon as class };

	const baseClass = `border-2 py-2 px-4 w-full border-black hover:bg-black hover:text-white text-center transition-all focus:bg-black focus:text-white active:scale-95 ${classAddon}`;
</script>

<button
	class={baseClass}
	on:click={onClick}
	{disabled}
>
	{#if !loading}
		<slot />
	{:else}
		<div class="flex items-center justify-center">
			<Loader />
		</div>
	{/if}
</button>
