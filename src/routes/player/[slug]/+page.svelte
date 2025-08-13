<script lang="ts">
	import { createSearchStore, searchHandler } from '$stores/search.js';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import PlayerCard from '$components/player/PlayerCard.svelte';
  import RecentGames from '$components/home/RecentGames.svelte';
  import { page } from '$app/state';

	const { data } = $props();
	let searchPlayers = $derived(data.pairings.map((pairing) => ({
		...pairing,
		searchTerms: `
		${pairing.player1.psUser}
		${pairing.player2.psUser}
		${pairing.player1.username}
		${pairing.player2.username}
		${pairing.tournament.name}
		${pairing.tournament.format}
		`
	})));
	let searchStore = $derived(createSearchStore(searchPlayers));
	let unsubscribe: (() => void) | undefined;
	$effect(() => {
		unsubscribe?.();
		unsubscribe = searchStore.subscribe((model) => searchHandler(model));
	});
	onDestroy(() => unsubscribe?.());

	let pageSize = 10;
	let totalItems: number = $derived(data.count);
	let totalPages: number = $derived(Math.ceil(totalItems / pageSize));
	let currentPage: number = $derived(Number(page.url.searchParams.get('recentMatches') || 1) - 1);

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>
{#snippet pageList()}
	<div class="join">
		{#each Array(totalPages) as _, i}
			<button
				class="join-item btn {currentPage === i ? 'btn-active' : ''}"
				aria-label="{(i + 1).toString()}"
				onclick={() => {
								goto(`/player/${data.player.psUser}?recentMatches=${i + 1}`, {
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
		<h1 class="text-4xl font-bold mb-2">Players</h1>
	</div>
	<div class="space">
		<PlayerCard player={data.player} accolades={data.accolades}/>
	</div>
	<div class="divider">Recent Matches</div>
		{@render pageList()}
	<!--	<div class="search-wrapper inline-flex pb-4">-->
<!--		<label class="input">-->
<!--			<Search class="w-4 h-4" />-->
<!--			<input type="search" class="grow" placeholder="Search match..." bind:value={$searchStore.search} />-->
<!--		</label>-->
<!--	</div>-->
	<ul class="space-y-2">
		{#each $searchStore.filtered as pairing}
			<li>
				<RecentGames pairing={pairing}/>
			</li>
		{/each}
	</ul>
	{@render pageList()}
</main>
