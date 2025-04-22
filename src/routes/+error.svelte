<script lang="ts">
	import { page } from '$app/state';
	import { emojis } from './emojis.js';
</script>

<h1>{page.status} {page.error?.message}</h1>
{emojis[page.status] ?? emojis[500]}
