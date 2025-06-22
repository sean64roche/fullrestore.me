<script lang="ts">
	import { onDestroy } from 'svelte';
	import RoundList from '$components/round/RoundList.svelte';
	import { getTournamentStatus } from '$lib/helpers';
	import { createSearchStore, searchHandler } from '$stores/search';
	import { getEliminationType, type PairingPage } from '$lib/roundCategory';
	import { Search } from 'lucide-svelte';

	const { data } = $props();
	const rounds = data.allRounds.map(r => r.roundNumber);
	let brackets = $derived(getEliminationType(
			(data.pairings.length <= 1 ? -1 : +data.tournament.elimination),
			data.round.roundNumber
	));
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

{#snippet pairings(pairing: PairingPage)}
	<h2 class="text-2xl mb-2 header">
		<a href="
							/match
							/{data.tournament.format}
							/{data.tournament.slug}
							/r{data.round.roundNumber}
							/{pairing.player1.psUser}-vs-{pairing.player2.psUser}"
			 class="link"
			 target="_blank"
		>
			{pairing.player1.username} vs. {pairing.player2.username}
		</a>
	</h2>
	<div class="flex flex-col">
	</div>
{/snippet}

<div class="container mx-auto py-8 px-4">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/tournament">Tournaments</a></li>
			<li><a href="/tournament/{data.tournament.slug}">{data.tournament.name}</a></li>
			<li><a href="/tournament/{data.tournament.slug}/r{data.round.roundNumber}">Round {data.round.roundNumber}</a></li>
		</ul>
	</div>
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">{data.tournament.name} Round {data.round.roundNumber}</h1>
		<p class="text-gray-500">
			{data.tournament.info}
		</p>
		<div class="player-cards">
			<div class="search-wrapper inline-flex">
				<label class="input">
					<Search class="w-4 h-4" />
					<input type="search" class="grow" placeholder="Search player..." bind:value={$searchStore.search} />
				</label>
				<RoundList
					tournament={data.tournament}
					rounds={rounds}
					status={getTournamentStatus(data.tournament.startDate, data.tournament.finishDate).status}
				/>
			</div>
		</div>

	</div>
	<div class="space pairing">
		{#if brackets.groups[0]}
			{#each brackets.groups as group}
				{@const groupPairings = $searchStore.filtered.filter(pairing => brackets.groups.indexOf(group) === pairing.p1score)}
				{#if groupPairings.length > 0}
					<div class="divider divider-neutral font-medium">{group}</div>
					{#each groupPairings as pairing}
						{@render pairings(pairing)}
						<div class="divider"></div>
					{/each}
				{/if}
			{/each}
		{:else}
			{#each $searchStore.filtered as pairing}
				{@render pairings(pairing)}
				<div class="divider"></div>
			{/each}
		{/if}
	</div>
</div>