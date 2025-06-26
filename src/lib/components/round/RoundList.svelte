<script lang="ts">
	import { Ellipsis } from 'lucide-svelte';
	import type { TournamentEntity } from '@fullrestore/service';
  import { onMount } from 'svelte';

	let { tournament, rounds, status }: {
		tournament: TournamentEntity,
		rounds: number[],
		status: string
	} = $props();
	rounds = rounds.toSorted((a, b) => b - a);
	let visibleRounds = $state((rounds?.slice(0, 0)));
	let hiddenRounds = $state<number[]>([]);

  let screenSize = $state<'sm' | 'md' | 'lg'>('md');

  function updateScreenSize() {
	  const width = window.innerWidth;
	  if (width < 640) screenSize = 'sm';
	  else if (width < 1024) screenSize = 'md';
	  else screenSize = 'lg';
  }

  onMount(() => {
	  updateScreenSize();
	  window.addEventListener('resize', updateScreenSize);
	  return () => window.removeEventListener('resize', updateScreenSize);
  });

  $effect(() => {
	  let visibleCount = 4;
	  if (screenSize === 'sm') visibleCount = 3;
	  if (screenSize === 'md') visibleCount = 6;
	  if (screenSize === 'lg') visibleCount = 9;

	  visibleRounds = rounds.slice(0, visibleCount);
	  hiddenRounds = rounds.slice(visibleCount);
  });


</script>

<div class="relative flex gap-2 ps-2 items-center whitespace-nowrap">
	{#each visibleRounds as round}
		<a href="/tournament/{tournament.slug}/r{round}" class="link text-sm" data-sveltekit-preload-data="tap">
			{round === rounds[0] && status === 'completed' ? 'Finals' : `Round ${round}`}
		</a>
	{/each}

	{#if hiddenRounds.length > 0}
		<div class="dropdown dropdown-end">
			<button tabindex="0" class="btn btn-ghost btn-xs">
				<Ellipsis class="w-4 h-4" />
			</button>
			<ul class="dropdown-content z-[100] menu p-2 shadow bg-base-100 rounded-box w-36">
				{#each hiddenRounds as round}
					<li><a href="/tournament/{tournament.slug}/r{round}" class="text-sm">{`Round ${round}`}</a></li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

