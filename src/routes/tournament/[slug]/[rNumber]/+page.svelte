<script lang="ts">

	const { data } = $props();

</script>

<div class="container mx-auto py-8 px-4">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">{data.tournament.name}, Round {data.round.roundNumber}</h1>
		<p class="text-gray-500">
			{data.tournament.info}
		</p>
	</div>
	<div class="space">
		{#each data.pairings as pairing}
			<h2 class="text-2xl font-bold mb-2">
				<a href="pairings/{pairing.id}">
					{pairing.player1} vs {pairing.player2}
				</a>
			</h2>
			<div class="flex flex-col">
<!--				<PairingCard pairing={pairing}/>-->
				<div class="divider"></div>
			</div>
		{/each}
	</div>
</div>