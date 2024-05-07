<script lang="ts">
	import Check from 'svelte-material-icons/Check.svelte';

	export let status = 'Success';
</script>

<div class="py-2 px-4 w-full bg-green-100 flex">
	<span class="font-bold text-green-600 flex items-center mr-1">
		<Check class="h-6 w-6 mr-2" /><span>{status}:</span>
	</span>
	<span class="mx-1"><slot /></span>
</div>
