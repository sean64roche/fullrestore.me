<script lang="ts">

  import type { PlayerPairing } from '$api/pairingsApi.server';

  let { pairing }: { pairing: PlayerPairing } = $props();

</script>

<h2 class=" mb-2 header">
	<strong><a href="
						/match
						/{pairing.tournament.format}
						/{pairing.tournament.slug}
						/r{pairing.round}
						/{pairing.player1.psUser}-vs-{pairing.player2.psUser}"
						 class="link-hover"
						 target="_blank"
	>
		{pairing.player1.username} vs. {pairing.player2.username}
	</a></strong>
</h2>
<small>
	{pairing.tournament.format}
	<span>·</span>
	<a href="/tournament/{pairing.tournament.slug}" class="link-hover">{pairing.tournament.name}</a>
	<span>·</span>
	<a href="/tournament/{pairing.tournament.slug}/r{pairing.round}" class="link-hover">Round {pairing.round}</a>
</small>
