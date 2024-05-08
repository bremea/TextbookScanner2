<script lang="ts">
	import Close from 'svelte-material-icons/Close.svelte';

	export let close = () => {};
</script>

<div
	class="top-0 left-0 z-40 flex items-center justify-center w-screen h-full absolute bg-black bg-opacity-15 backdrop-blur-sm"
>
	<div
		class="max-h-screen overflow-auto z-50 absolute bg-white border-black border-2 py-4 px-8 shadow-lg pr-16"
	>
		<button on:click={close}>
			<Close class="absolute right-2 top-2 w-8 h-8 hover:scale-105 active:scale-95" />
		</button>
		<slot />
	</div>
</div>
