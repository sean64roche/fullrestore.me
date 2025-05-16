<script lang="ts">
	import { Calendar } from 'lucide-svelte';
  import type { TournamentQParams } from '../../../api/tournamentsApi';
  import { compareAsc } from 'date-fns';
  import RoundList from '$components/round/RoundList.svelte';

	let { tournament }: { tournament: TournamentQParams } = $props();
	let rounds: number[] = tournament.rounds.
		map(round => round.roundNumber).
		toSorted((a, b) => b - a);

	let descExpanded = $state(false);
	let canExpandDesc = $state(false);
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

  const getStatus = (startDate: string, endDate?: string) => {
	  switch (compareAsc(startDate, Date.now())) {
		  case 1:
			case 0:
				if (endDate && compareAsc(endDate, Date.now()) === 1) {
					return {
						style: 'bg-neutral text-neutral-content',
						status: 'completed'
					};
				} else {
					return {
						style: 'bg-secondary text-secondary-content',
						status: 'ongoing'
					};
				}
			case -1:
				return {
					style: 'bg-secondary text-secondary-content',
					status: 'upcoming'
				};
		  default:
			  return {
					style: 'bg-secondary text-secondary-content',
					status: 'unknown'
				};
	  }
  };

</script>

{#snippet status()}
	<div class="badge badge-ghost {getStatus(tournament.startDate, tournament.finishDate).style}">
		{getStatus(tournament.startDate, tournament.finishDate).status}
	</div>
{/snippet}

<div class="card md:card-side bg-base-100 shadow-sm hover:shadow-lg transition-shadow">
	<figure class="md:w-auto h-auto md:min-w-[200px] flex items-center justify-center">
		<img
			src="revival2.webp"
			alt="Image of {tournament.name} Logo"
			class="h-auto md:h-[200px] object-contain w-auto max-w-full"
		/>
	</figure>
	<div class="card-body flex flex-col justify-between">
		<div class="flex justify-between items-start flex-wrap">
			<div>
				<h2 class="card-title">{tournament.name}</h2>
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
			<RoundList tournament={tournament}
			 rounds={rounds}
			 status={getStatus(tournament.startDate, tournament.finishDate).status}
			/>
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