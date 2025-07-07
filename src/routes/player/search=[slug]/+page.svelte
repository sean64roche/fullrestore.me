<script lang="ts">
	import { isAlt } from '$lib/helpers';

  const { data } = $props();

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<main class="max-w-4xl mx-auto px-4 space-y-12 py-8">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">Search Player: {data.slug}</h1>
	</div>
	<div class="divider"></div>
	<ul class="space-y-2">
	{#each data.players as player}
		<li class="border border-black rounded p-4 shadow-sm bg-base-200">
			<h2><strong>
				<a href="/player/{player.psUser}" class="link-hover">{player.username}</a>
			</strong></h2>
			{#if isAlt(player.psUser, player.username)}
				<small>Also known as: {player.psUser}</small>
			{/if}
		</li>
	{/each}
		{#if data.players.length < 1}
			<p class="text-gray-500">No players found for "{data.slug}".</p>
		{/if}
	</ul>
</main>