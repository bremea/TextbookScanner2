<script lang="ts">
	export let placeholder = 'Password';
	let bindValue: string = '';
	export let autocomplete: string = '';
	export { bindValue as value };
</script>

<input
	class="border-2 py-2 px-4 w-full border-black"
	{placeholder}
	type="password"
	{autocomplete}
	bind:value={bindValue}
/>
