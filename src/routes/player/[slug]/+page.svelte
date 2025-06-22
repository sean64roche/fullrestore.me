<script lang="ts">
	import { createSearchStore, searchHandler } from '$stores/search.js';
	import { onDestroy } from 'svelte';
  import { Search } from 'lucide-svelte';

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
		`,
	})));
	let searchStore = $derived(createSearchStore(searchPlayers));
	let unsubscribe: (() => void) | undefined;
	$effect(() => {
		unsubscribe?.();
		unsubscribe = searchStore.subscribe((model) => searchHandler(model));
	});
	onDestroy(() => unsubscribe?.());

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<h1 class="text-4xl text-center align-middle">Player</h1>

<div class="divider">Recent Matches</div>
<div class="search-wrapper inline-flex">
	<label class="input">
		<Search class="w-4 h-4" />
		<input type="search" class="grow" placeholder="Search match..." bind:value={$searchStore.search} />
	</label></div>
{#each $searchStore.filtered as pairing}
	<h2 class="text-2xl mb-2 header">
		<a href="
							/match
							/{pairing.tournament.format}
							/{pairing.tournament.slug}
							/r{pairing.round}
							/{pairing.player1.psUser}-vs-{pairing.player2.psUser}"
			 class="link"
			 target="_blank"
		>
			{pairing.player1.username} vs. {pairing.player2.username}	<div class="text-sm">{pairing.tournament.format} | {pairing.tournament.name} | Round {pairing.round}</div>
		</a>
	</h2>
	<div class="flex flex-col">
	</div>
	<div class="divider"></div>
{/each}