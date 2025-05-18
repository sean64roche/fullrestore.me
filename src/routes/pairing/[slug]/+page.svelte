<script lang="ts">
		import MatchPanel from '$components/pairing/MatchPanel.svelte';
		const { data } = $props();
</script>

<div class="container mx-auto py-8 px-4">
	<div class="mb-8">
			<MatchPanel
				tournament={data.tournament}
				round={data.round}
				player1={data.player1}
				player2={data.player2}
				replays={data.pairing.replays}
			/>
	</div>
</div>