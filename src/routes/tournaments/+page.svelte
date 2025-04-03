<script lang="ts">
	import TournamentCard from '$components/tournaments/TournamentCard.svelte';
	import { SAMPLE_TOURNAMENTS } from './mockTournaments';

	let getStatusColor = (status: string) => {
		switch (status) {
			case 'upcoming':
				return 'bg-green-500 hover:bg-green-600';
			case 'completed':
				return 'bg-gray-500 hover:bg-gray-600';
			case 'ongoing':
				return 'bg-blue-500 hover:bg-blue-600';
			default:
				return 'bg-gray-500 hover:bg-gray-600';
		}
	};
</script>

<div class="container mx-auto py-8 px-4">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">Tournaments</h1>
		<p class="text-gray-500">
			Browse upcoming and past esports tournaments across multiple games
		</p>
	</div>
	<div class="space">
			{#each SAMPLE_TOURNAMENTS as tournament}
				<div class="flex flex-col">
					<TournamentCard tournament={tournament} />
					<div class="divider"></div>
				</div>
			{/each}
	</div>
</div>


