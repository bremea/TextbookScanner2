<script lang="ts">
	import Close from 'svelte-material-icons/Close.svelte';

	export let status = 'Error';
</script>

<div class="py-2 px-4 w-full bg-red-100 flex">
	<span class="font-bold text-red-500 flex items-center mr-1">
		<Close class="h-6 w-6 mr-2" /><span>{status}:</span>
	</span>
	<span class="mx-1"><slot /></span>
</div>
