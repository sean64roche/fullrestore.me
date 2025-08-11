<script lang="ts">
	import type { PlayerPairing } from '$api/pairingsApi.server';
	import { onMount } from 'svelte';
	import { Crown } from 'lucide-svelte';

	let { pairing }: { pairing: PlayerPairing } = $props();
	let showWinners = $state('false');
  let target = $state('_self');

  onMount(() => {
		const storedShowWinners = localStorage.getItem('showWinners');
		if (storedShowWinners) {
			showWinners = storedShowWinners;
		}
	  const storedTarget = localStorage.getItem('defaultMatchNewTab');
	  if (storedTarget) {
		  target = storedTarget;
	  }
	});

</script>
<a href="
						/match
						/{pairing.tournament.format}
						/{pairing.tournament.slug}
						/r{pairing.round}
						/{pairing.player1.psUser}-vs-{pairing.player2.psUser}"
	 class="block border border-black rounded p-4 shadow-sm bg-base-200 hover:bg-base-300"
	 target={target}
>
	<h2 class=" mb-2 header flex justify-between items-center">
		<strong>
			{pairing.player1.username} vs. {pairing.player2.username}
		</strong>
		{#if showWinners === 'true' && !!pairing.winner}
		<span class="text-xs text-right sm:text-sm items-center italic inline-flex gap-1">
			{pairing.winner.username}
			<Crown class="w-4 h-4" />
		</span>
		{/if}
	</h2>
	<small>
		{pairing.tournament.name}
		<span>·</span>
		Round {pairing.round}
		<span>·</span>
		{pairing.tournament.format}
	</small>
</a>
