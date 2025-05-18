<script lang="ts">
	import { Search } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import RoundList from '$components/round/RoundList.svelte';
  import { getTournamentStatus } from '$lib/helpers';
  import { createSearchStore, searchHandler } from '$stores/search';

  const { data } = $props();
  const rounds: number[] = [];
  data.allRounds.forEach((round) => {
	  rounds.push(round.roundNumber);
	});

  const searchPlayers = data.pairings.map((pairing) => ({
		...pairing,
		searchTerms: `${pairing.player1} ${pairing.player2}`,
	}));
  const searchStore = createSearchStore(searchPlayers);
  const unsubscribe = searchStore.subscribe((model) => searchHandler(model));
  onDestroy(() => {
	  unsubscribe();
  });

</script>

<div class="container mx-auto py-8 px-4">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">{data.tournament.name} Round {data.round.roundNumber}</h1>
		<p class="text-gray-500">
			{data.tournament.info}
		</p>
		<div class="player-cards" data-player-cards-container>
			<div class="search-wrapper inline-flex">
				<label class="input">
					<Search class="w-4 h-4" />
					<input type="search" class="grow" placeholder="Search Player..." bind:value={$searchStore.search} />
				</label>
				<RoundList
					tournament={data.tournament}
					rounds={rounds}
					status={getTournamentStatus(data.tournament.startDate, data.tournament.finishDate)}/>
			</div>

		</div>
		<div class="divider"></div>
	</div>
	<div class="space pairing">
		{#each $searchStore.filtered as pairing}
			<h2 class="text-2xl mb-2 header">
				<a href="
				/match
				/{data.tournament.format}
				/{data.tournament.slug}
				/r{data.round.roundNumber}
				/{pairing.player1}-vs-{pairing.player2}"
					 class="link"
					 target="_blank"
				>
					{pairing.player1} vs. {pairing.player2}
				</a>
			</h2>
			<div class="flex flex-col">
				<!--				<PairingCard pairing={pairing}/>-->
				<div class="divider"></div>
			</div>
		{/each}
	</div>
</div>