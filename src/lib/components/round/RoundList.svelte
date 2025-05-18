<script lang="ts">
	import { Ellipsis } from 'lucide-svelte';
	import type { TournamentQParams } from '../../../api/tournamentsApi';

	let { tournament, rounds, status }: {
		tournament: TournamentQParams,
		rounds: number[],
		status: string
	} = $props();
	rounds = rounds.toSorted((a, b) => b - a);
	let visibleRounds = (rounds?.slice(0, 4));
	let hiddenRounds = (rounds?.length > 4 ? rounds.slice(4) : []);
</script>

<div class="flex gap-2 items-center">
	{#each visibleRounds as round}
		<a href="/tournament/{tournament.slug}/r{round}" class="link text-sm">
			{round === rounds[0] && status === 'completed' ? 'Finals' : `Round ${round}`}
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
			<ul
				class="dropdown-content absolute right-0 top-6 bg-base-100 shadow-lg rounded-lg p-2 z-10 w-36 flex flex-col gap-1">
				{#each hiddenRounds as round}
					<li><a href="/tournament/{tournament.slug}/r{round.toString()}"
								 class="link text-sm block p-1 hover:bg-base-200 rounded">
						{`Round ${round}`}
					</a></li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
