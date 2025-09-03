<script lang="ts">
	import { Trophy } from 'lucide-svelte';
  import type { Accolade, PlayerQParams } from '$api/playerApi.server';
  import { isAlt } from '$lib/helpers';

  let logoError = $state(false);
  let { player, accolades }: { player: PlayerQParams, accolades: Accolade[] } = $props();
	let randomPlaceholder = (Math.random() * 10 < 5);

</script>

<div class="card md:card-side bg-base-100 shadow-sm hover:shadow-lg transition-shadow">
	<figure class="md:w-auto h-auto md:min-w-[200px] flex items-center justify-center">
		{#if !logoError}
			<img
				src="https://fullrestore.b-cdn.net/{player.username}.webp"
				alt="Image of {player.username} Logo"
				class="h-auto md:h-[200px] object-contain w-auto max-w-full"
				onerror="{() => logoError = true}"
			/>
		{:else }
			<img
				src={randomPlaceholder? "/lucas-silhouette.png" : "/dawn-silhouette.png"}
				alt="Image of {player.username} Logo"
				class="h-auto md:h-[200px] object-contain w-auto max-w-full"
			/>
		{/if}
	</figure>
	<div class="card-body flex flex-col justify-between">
		<div class="flex justify-between items-start flex-wrap">
			<div class="grid grid-rows-{1 + accolades.length} gap-0">
				<h2 class="card-title text-2xl">
					{player.username}
				</h2>
				<h2 class="block">
					{#if isAlt(player.psUser, player.username)}
						Also known as: {player.psUser}
					{/if}
				</h2>
				<h2 class="flex items-center gap-2 flex-wrap">
					{#each accolades as accolade}
						<Trophy />{accolade.tournamentName}: 1st Place
					{/each}
				</h2>
			</div>
		</div>
	</div>
</div>