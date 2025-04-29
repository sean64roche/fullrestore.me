<script lang="ts">
	import { Calendar, Ellipsis } from 'lucide-svelte';
  import type { Tournament } from '../../../routes/tournaments/+page.server';
  import { compareAsc } from 'date-fns';

	let { tournament }: { tournament: Tournament } = $props();
	let rounds: number[] = tournament.rounds.
		map(round => round.number).
		toSorted((a, b) => b - a);

	let visibleRounds = (rounds.slice(0, 4));
	let hiddenRounds = (rounds.length > 4 ? rounds.slice(4) : []);
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
						style: 'bg-gray-500 hover:bg-gray-600',
						status: 'completed'
					};
				} else {
					return {
						style: 'bg-blue-500 hover:bg-blue-600',
						status: 'ongoing'
					};
				}
			case -1:
				return {
					style: 'bg-green-500 hover:bg-green-600',
					status: 'upcoming'
				};
		  default:
			  return {
					style: 'bg-gray-500 hover:bg-gray-600',
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
					<div class="badge badge-ghost bg-purple-500 hover:bg-purple-600">{tournament.format}</div>
					{@render status()}
				</div>
			</div>
			<div class="mt-2 md:mt-0 md:static">
				<div class="flex gap-2 items-center justify-end">
					{#each visibleRounds as round}
						<a href="tournaments/{tournament.slug}/r{round.toString()}" class="link text-sm">
							{round === rounds[0] && getStatus(tournament.startDate, tournament.finishDate).status === 'completed' ? 'Finals' : `Round ${round}`}
						</a>
					{/each}
					{#if hiddenRounds.length > 0}
						<div class="dropdown dropdown-end dropdown-hover">
							<button
								tabindex="0"
								class="btn btn-ghost btn-xs"
							>
								<Ellipsis class="w-4 h-4" />
							</button>
							<ul class="dropdown-content absolute right-0 top-6 bg-base-100 shadow-lg rounded-lg p-2 z-10 w-36 flex flex-col gap-1">
								{#each hiddenRounds as round}
									<li><a href="tournaments/{tournament.slug}/r{round.toString()}" class="link text-sm block p-1 hover:bg-base-200 rounded">
										{`Round ${round}`}
									</a></li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
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