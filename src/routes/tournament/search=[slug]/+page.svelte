<script lang="ts">
  import TournamentCard from '$components/tournament/TournamentCard.svelte';

  const { data } = $props();
  console.log(JSON.stringify(data.foundTournaments));

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<main class="max-w-4xl mx-auto px-4 space-y-12 py-8">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">Search Tournament: {data.slug}</h1>
	</div>
	<div class="divider"></div>
	<ul class="space-y-2">
		{#each data.foundTournaments as tournament}
			<TournamentCard tournament={tournament} />
		{/each}
	</ul>
	{#if data.foundTournaments.length < 1}
		<p class="text-gray-500">No tournaments found for "{data.slug}".</p>
	{/if}
</main>