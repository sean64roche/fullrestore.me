<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import RoundList from '$components/round/RoundList.svelte';
	import { getTournamentStatus } from '$lib/helpers';
	import { createSearchStore, searchHandler } from '$stores/search';
	import { getEliminationType, type PairingPage } from '$lib/roundCategory';
	import { Crown, Search } from 'lucide-svelte';
	import { navigating } from '$app/state';

	const { data } = $props();
	let target = $state('_self');
	let showWinners = $state('false');
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
		`
	})));
	let searchStore = $derived(createSearchStore(searchPlayers));
	let unsubscribe: (() => void) | undefined;
	$effect(() => {
		unsubscribe?.();
		unsubscribe = searchStore.subscribe((model) => searchHandler(model));
	});
	onDestroy(() => unsubscribe?.());

	onMount(() => {
		const storedTarget = localStorage.getItem('defaultMatchNewTab');
		if (storedTarget) {
			target = storedTarget;
		}
		const storedShowWinners = localStorage.getItem('showWinners');
		if (storedShowWinners) {
			showWinners = storedShowWinners;
		}
	});

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

{#snippet pairings(pairing: PairingPage)}
	<h2>
		{#if !pairing.replays || pairing.replays.length < 1}
			<div class="border border-black rounded p-4 shadow-sm bg-base-200 mb-2 header flex justify-between items-center ">
				<strong><span class="text-gray-500">{pairing.player1.username} vs. {pairing.player2.username}</span></strong>
				{#if !!pairing.winner}
			<span class="text-gray-500 text-xs text-right sm:text-sm inline-flex items-center">
				{pairing.winner.username}&nbsp;<Crown class="w-4 h-4" />
			</span>
				{/if}
			</div>
		{:else}
			<a href="
							/match
							/{data.tournament.format}
							/{data.tournament.slug}
							/r{data.round.roundNumber}
							/{pairing.player1.psUser}-vs-{pairing.player2.psUser}"
								 class="border border-black rounded p-4 shadow-sm bg-base-200 mb-2 header flex justify-between items-center hover:bg-base-300"
								 target={target}
			>
				<strong>{pairing.player1.username} vs. {pairing.player2.username}</strong>

			{#if showWinners === 'true' && !!pairing.winner}
				<span class="text-xs text-right sm:text-sm inline-flex items-center">
					{pairing.winner.username}&nbsp;<Crown class="w-4 h-4" />
				</span>
			{/if}
			</a>
		{/if}
	</h2>
{/snippet}

<main class="max-w-4xl mx-auto px-4 space-y-12 py-8">
	<section class="breadcrumbs text-sm">
		<ul>
			<li><a href="/tournament">Tournaments</a></li>
			<li><a href="/tournament/{data.tournament.slug}"
						 class="text-gray-500 pointer-events-none">{data.tournament.name}</a></li>
			<li><a href="/tournament/{data.tournament.slug}/r{data.round.roundNumber}">Round {data.round.roundNumber}</a></li>
		</ul>
	</section>

	<section class="mb-8">
		<h1 class="text-2xl font-bold mb-2">{data.tournament.name}, Round {data.round.roundNumber}</h1>
		<p class="text-gray-500 gap-2 mb-2">
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
	</section>

	{#if navigating.to}
		<div class="flex justify-center items-center w-full mt-4">
			<span class="loading loading-bars loading-xl"></span>
		</div>
	{:else}
		<section class="space pairing">
			{#if brackets.groups[0]}
				{#each brackets.groups as group}
					{@const
						groupPairings = $searchStore.filtered.filter(pairing => brackets.groups.indexOf(group) === pairing.p1score)}
					{#if groupPairings.length > 0}
						<div class="divider font-medium">{group}</div>
						{#each groupPairings as pairing}
							{@render pairings(pairing)}
						{/each}
					{/if}
				{/each}
			{:else}
				{#each $searchStore.filtered as pairing}
					{@render pairings(pairing)}
				{/each}
			{/if}
		</section>
	{/if}
</main>
