<script lang="ts">
  import TournamentCard from '$components/tournament/TournamentCard.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const { data } = $props();

  let pageSize = 10;
  let totalItems = $derived(data.count);
  let totalPages = $derived(Math.ceil(totalItems / pageSize));
  let currentPage: number = $derived(Number(page.url.searchParams.get('page') || 1) - 1);

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

{#snippet pageList()}
	<div class="join">
		{#each Array(totalPages) as _, i}
			<button class="join-item btn {currentPage === i ? 'btn-active' : ''}"
							aria-label="Recent Tournaments, Page {i}"
							onclick={() => {
								goto(`/tournament/search?query=${data.slug}&page=${i + 1}`, {
												replaceState: true,
												keepFocus: true,
												noScroll: true
								});
							}}
			>
				{i + 1}
			</button>
		{/each}
	</div>
{/snippet}

<main class="max-w-4xl mx-auto px-4 space-y-12 py-8">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">Search Tournament: {data.slug}</h1>
	</div>
	<div class="divider"></div>
	{@render pageList()}
	<ul class="space-y-2">
		{#each data.foundTournaments as tournament}
			<TournamentCard tournament={tournament} />
		{/each}
	</ul>
	{#if data.foundTournaments.length < 1}
		<p class="text-gray-500">No tournaments found for "{data.slug}".</p>
	{/if}
	{@render pageList()}
</main>
