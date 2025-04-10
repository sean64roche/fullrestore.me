<script lang="ts">
import type { PageProps } from './$types';

let { data }: PageProps = $props();
</script>

<div class="container mx-auto py-8 px-4">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">{data.title}</h1>
		<p class="text-gray-500">
			{data.content}
		</p>
	</div>
	<div class="space">
	</div>
</div>