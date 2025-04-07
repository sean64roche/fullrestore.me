<script lang="ts">
	import { getStatusColor, type Tournament } from '../../../routes/tournaments/mockTournaments';
	import { Calendar, ChevronDown } from 'lucide-svelte';
	import { reverseRounds } from '../../../routes/tournaments/mockTournaments.js';

	let { tournament } = $props<{ tournament: Tournament }>();
	let rounds: number[] = reverseRounds(tournament.rounds);

	let descExpanded = $state(false);
	let canExpandDesc = $state(false);

	let textContainer: HTMLDivElement | undefined;

	let visibleRounds = rounds.slice(0, 4);
	let hiddenRounds = rounds.length > 4 ? rounds.slice(4) : [];

	function toggleExpandedDesc() {
		descExpanded = !descExpanded;
	}

	$effect(() => {
		if (!textContainer) return;
		canExpandDesc = textContainer.scrollHeight > textContainer.clientHeight;
	});

</script>

<div class="card md:card-side bg-base-100 shadow-sm hover:shadow-lg transition-shadow">
	<figure class="content-center md:w-1/2">
		<img
			src="revival2.webp"
			alt="Image of {tournament.name} Logo"
			class="md:object-contain m-auto w-full"
		/>
	</figure>
	<div class="card-body flex flex-col justify-between">
		<div class="flex justify-between items-start flex-wrap">
			<div>
				<h2 class="card-title">{tournament.name}</h2>
				<div class="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
					<Calendar class="w-4 h-4" />
					{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
					<div class="badge badge-ghost bg-purple-500 hover:bg-purple-600">{tournament.game}</div>
					<div class="badge badge-ghost {getStatusColor(tournament.status)}">
						{tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
					</div>
				</div>
			</div>
			<div class="mt-2 md:mt-0 md:static">
				<div class="flex gap-2 items-center justify-end">
					{#each visibleRounds as round}
						<a href={round.toString()} class="link text-sm">
							{round === rounds[0] && tournament.status === 'completed' ? 'Finals' : `Round ${round}`}
						</a>
					{/each}
					{#if hiddenRounds.length > 0}
						<div class="dropdown">
							<button
								tabindex="0"
								class="btn btn-ghost btn-xs"
							>
								<ChevronDown class="w-4 h-4" />
							</button>
							<ul class="dropdown-content absolute right-0 top-6 bg-base-100 shadow-lg rounded-lg p-2 z-10 w-36 flex flex-col gap-1">
								{#each hiddenRounds as round}
									<li><a href={round.toString()} class="link text-sm block p-1 hover:bg-base-200 rounded">
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
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
				magna aliqua.
				Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
				Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</p>
		</div>
		{#if canExpandDesc}
				<button class="btn btn-xs mt-2" onclick={toggleExpandedDesc}>
					{descExpanded ? 'Show less' : 'Read more'}
				</button>
		{/if}
	</div>
</div>