<script lang="ts">
	import TournamentCard from '$components/tournament/TournamentCard.svelte';

	const { data } = $props();

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<main class="max-w-4xl mx-auto px-4 space-y-12 py-8">
	<div class="mb-8">
		<h1 class="text-2xl font-bold mb-2">Recent Tournaments</h1>
<!--		<p class="text-gray-500">-->
<!--			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore-->
<!--			magna aliqua.-->
<!--			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.-->
<!--			Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.-->
<!--			Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.-->
<!--		</p>-->
	</div>
	<div class="space">
		{#each data.tournaments as tournament}
			<div class="flex flex-col">
				<TournamentCard tournament={tournament}/>
				<div class="divider"></div>
			</div>
		{/each}
	</div>
</main>


