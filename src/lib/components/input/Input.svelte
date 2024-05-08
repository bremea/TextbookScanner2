<script lang="ts">
	export let placeholder = 'Type here';
	let bindValue: string = '';
	export let bindTo: HTMLInputElement;
	export let autocomplete: string = '';
	export let autofocus = false;
	export let onInput = () => {};
	export { bindValue as value };
</script>

<input
	class="border-2 py-2 px-4 w-full border-black"
	{placeholder}
	type="text"
	{autocomplete}
	bind:value={bindValue}
	bind:this={bindTo}
	{autofocus}
	on:input={onInput}
/>
