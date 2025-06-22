<script lang="ts">
	import { createSearchStore, searchHandler } from '$stores/search.js';
	import { onDestroy } from 'svelte';
  import ItemSearch from '$components/ItemSearch.svelte';

  const { data } = $props();
	let searchPlayers = $derived(data.pairings.map((pairing) => ({
		...pairing,
		searchTerms: `
		${pairing.player1.psUser}
		${pairing.player2.psUser}
		${pairing.player1.username}
		${pairing.player2.username}
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
	<ItemSearch search={$searchStore.search} subject="Search match..."/>
</div>