<script lang="ts">
	import type { PlayerPairing } from '$api/pairingsApi.server';
	import { onMount } from 'svelte';
	import { Crown } from 'lucide-svelte';

	let { pairing }: { pairing: PlayerPairing } = $props();
	let showWinners = $state('false');

	onMount(() => {
		const storedShowWinners = localStorage.getItem('showWinners');
		if (storedShowWinners) {
			showWinners = storedShowWinners;
		}
	});

</script>
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