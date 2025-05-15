<script lang="ts">

	const { data } = $props();

</script>

<div class="container mx-auto py-8 px-4">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">
			{data.player1.psUser} vs. {data.player2.psUser} — {data.tournament.name} Round {data.round.roundNumber}
		</h1>
	</div>
</div>