<script lang="ts">
  import type { PlayerPairing } from '$api/pairingsApi.server';
  import { onMount } from 'svelte';

  let { pairing }: { pairing: PlayerPairing } = $props();
  let target = $state("_self");

  onMount(() => {
		const storedTarget = localStorage.getItem('defaultMatchNewTab');
		if (storedTarget) {
			target = storedTarget;
		}
	});

</script>

<h2 class=" mb-2 header">
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
</h2>
<small>
	<a href="/tournament/{pairing.tournament.slug}" class="link-hover">{pairing.tournament.name}</a>
	<span>·</span>
	<a href="/tournament/{pairing.tournament.slug}/r{pairing.round}" class="link-hover">Round {pairing.round}</a>
	<span>·</span>
	{pairing.tournament.format}
</small>
