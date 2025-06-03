<script lang="ts">
	import { page } from '$app/state';
	import { emojis } from './emojis.js';
</script>

<h1 class="text-4xl text-center align-middle">{page.status} {page.error?.message}
	<br>
	{emojis[page.status] ?? emojis[500]}
</h1>
