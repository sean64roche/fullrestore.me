<script lang="ts">
  import type { PlayerPairing } from '$api/pairingsApi.server';
  import { onMount } from 'svelte';
  import { Crown } from 'lucide-svelte';

  let { pairing }: { pairing: PlayerPairing } = $props();
  let target = $state("_self");
  let showWinners = $state("false");

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

<h2 class=" mb-2 header flex justify-between items-center">
	<strong><a href="
						/match
						/{pairing.tournament.format}
						/{pairing.tournament.slug}
						/r{pairing.round}
						/{pairing.player1.psUser}-vs-{pairing.player2.psUser}"
						 class="link-hover"
						 target={target}
	>
		{pairing.player1.username} vs. {pairing.player2.username}
	</a></strong>
	{#if showWinners === 'true' && !!pairing.winner}
		<span class="text-xs text-right sm:text-sm inline-flex items-center">
			<a href="/player/{pairing.winner.psUser}" class="italic link-hover inline-flex gap-1">
				{pairing.winner.username} <Crown class="w-4 h-4"/>
			</a>
		</span>
	{/if}
</h2>
<small>
	<a href="/tournament/{pairing.tournament.slug}" class="link-hover">{pairing.tournament.name}</a>
	<span>·</span>
	<a href="/tournament/{pairing.tournament.slug}/r{pairing.round}" class="link-hover">Round {pairing.round}</a>
	<span>·</span>
	{pairing.tournament.format}
</small>
