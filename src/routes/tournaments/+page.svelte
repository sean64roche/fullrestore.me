<script lang="ts">
	import TournamentCard from '$components/tournaments/TournamentCard.svelte';

	const { data } = $props();

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
			orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
			magna aliqua.
			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
			Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
			Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		</p>
	</div>
	<div class="space">
		{#each data.tournaments as tournament}
			<div class="flex flex-col">
				<TournamentCard tournament={tournament}/>
				<div class="divider"></div>
			</div>
		{/each}
	</div>
</div>


