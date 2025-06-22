
<script lang="ts">
	import { Search } from 'lucide-svelte';
	let { search, subject } = $props();

</script>

<label class="input">
	<Search class="w-4 h-4" />
	<input type="search" class="grow" placeholder={subject} bind:value={search} />
</label>
