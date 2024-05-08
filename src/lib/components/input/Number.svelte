<script lang="ts">
	export let placeholder = 'Type here';
	let bindValue: string = '';
	export let autocomplete: string = '';
	export let min: number = 0;
	export let max: number = 999999999999;
	export { bindValue as value };
</script>

<input
	class="border-2 py-2 px-4 w-full border-black"
	{placeholder}
	type="number"
	{autocomplete}
	{min}
	{max}
	bind:value={bindValue}
/>
