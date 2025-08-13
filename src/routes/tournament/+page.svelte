<script lang="ts">
	import TournamentCard from '$components/tournament/TournamentCard.svelte';
	import { navigating } from '$app/state';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const { data } = $props();

	let pageSize = 10;
	let totalItems = $derived(data.count);
	let totalPages = $derived(Math.ceil(totalItems / pageSize));
	let currentPage: number = $derived(Number(page.url.searchParams.get('recentTournaments') || 1) - 1);

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

{#snippet pageList()}
	<div class="join">
		{#each Array(totalPages) as _, i}
			<button class="join-item btn {currentPage === i ? 'btn-active' : ''}"
							aria-label="Recent Matches, Page {i}"
							onclick={() => {
								goto(`/tournament?recentTournaments=${i + 1}`, {
												replaceState: true,
												keepFocus: true,
												noScroll: true
								});
							}}
			>
				{i + 1}
			</button>
		{/each}
	</div>
{/snippet}

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
	{@render pageList()}
	<div class="space">
		{#if navigating.to}
			<div class="flex justify-center items-center w-full mt-4">
				<span class="loading loading-bars loading-xl"></span>
			</div>
		{:else}
			{#each data.tournaments as tournament}
				<div class="flex flex-col">
					<TournamentCard tournament={tournament} />
					<div class="divider"></div>
				</div>
			{/each}
		{/if}
	</div>
	{@render pageList()}
</main>


