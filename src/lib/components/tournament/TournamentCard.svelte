<script lang="ts">
	import { Calendar } from 'lucide-svelte';
	import type { TournamentQParams } from '../../../api/tournamentsApi';
	import RoundList from '$components/round/RoundList.svelte';
	import { getTournamentStatus } from '$lib/helpers';
	import { Trophy } from 'lucide-svelte';

	let { tournament }: { tournament: TournamentQParams } = $props();
	let rounds: number[] = tournament.rounds.map(round => round.roundNumber);
	let descExpanded = $state(false);
	let canExpandDesc = $state(false);
	let logoError = $state(false);
	let textContainer: HTMLDivElement | undefined;

	function toggleExpandedDesc() {
		descExpanded = !descExpanded;
	}

	$effect(() => {
		if (!textContainer) return;
		canExpandDesc = textContainer.scrollHeight > textContainer.clientHeight;
	});
	let seasonName: string = typeof tournament.season === 'string' ? ': ' + tournament.season : ' ' + tournament.season.toString();
	let tournamentName: string = tournament.name + (+tournament.season === 1 ? '' : seasonName);

</script>

{#snippet status()}
	<div class="badge badge-ghost {getTournamentStatus(tournament.startDate, tournament.finishDate).style}">
		{getTournamentStatus(tournament.startDate, tournament.finishDate).status}
	</div>
{/snippet}

<div class="card md:card-side bg-base-100 shadow-sm hover:shadow-lg transition-shadow">
	<figure class="md:w-auto h-auto md:min-w-[200px] flex items-center justify-center">
		{#if !logoError}
			<img
				src="/images/tournament/{tournament.slug}.webp"
				alt="Image of {tournament.name} Logo"
				class="h-auto md:h-[200px] object-contain w-auto max-w-full"
				onerror="{() => logoError = true}"
			/>
		{:else }
			<Trophy class="text-gray-500 w-12 h-12" />
		{/if}
	</figure>
	<div class="card-body flex flex-col justify-between">
		<div class="flex justify-between items-start flex-wrap">
			<div>
				<h2 class="card-title">{tournamentName}</h2>
				<div class="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
					<Calendar class="w-4 h-4" />
					{new Date(tournament.startDate).toLocaleDateString()} -
					{#if tournament.finishDate}
						{new Date(tournament.finishDate).toLocaleDateString()}
					{/if}
					<div class="badge badge-ghost bg-accent text-accent-content">{tournament.format}</div>
					{@render status()}
				</div>
			</div>
			<div class="mt-2 md:mt-0 md:static justify-end">
				<RoundList tournament={tournament}
									 rounds={rounds}
									 status={getTournamentStatus(tournament.startDate, tournament.finishDate).status}
				/>
			</div>
		</div>
		<div
			bind:this={textContainer}
			class={descExpanded ? 'text-sm sm:text-base' : 'line-clamp-5 text-sm sm:text-base'}
		>
			{#if tournament.info}
				<p>{tournament.info}</p>
			{:else}
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
					Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			{/if}
		</div>
		{#if canExpandDesc}
			<button class="btn btn-xs mt-2" onclick={toggleExpandedDesc}>
				{descExpanded ? 'Show less' : 'Read more'}
			</button>
		{/if}
	</div>
</div>