<script lang="ts">
	import type { TournamentEntity, PlayerEntity, RoundEntity, ReplayEntity } from '@fullrestore/service';
	import type { ContentQParams } from '../../../api/pairingsApi';
	import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ReplayPanel from '$components/replay/ReplayPanel.svelte';
  import { primaryUsername } from '../../../api/playerApi';

  interface Props {
		tournament: TournamentEntity,
		round: RoundEntity,
		player1: PlayerEntity,
		player2: PlayerEntity,
		replays?: ReplayEntity[],
		content?: ContentQParams,
	}

	let { tournament, round, player1, player2, replays = [], content }: Props = $props();
  let activeTab = $state('replay');
	let activeReplay: number = $state(1);
	let gridList = !!replays ? getGridClass(replays.length) : 0;
	content = {
		id: 'test-id',
		url: 'https://www.youtube.com/embed/UGcCU6vR1OQ',
		type: 'youtube',
	}

	function getGridClass(count: number) {
		if (count === 1) return 'grid-cols-1';
		if (count === 2) return 'grid-cols-2';
		if (count === 3) return 'grid-cols-3';
		if (count === 4) return 'grid-cols-4';
		if (count >= 5) return 'grid-cols-5';
		return '';
	}

	function updateURL(newTab: string, gameNumber?: number) {
	  const url = page.url;
	  if (newTab === 'replay' && gameNumber) {
			url.hash = `game${gameNumber}`;
		} else {
			url.hash = '';
		}

		goto(url.pathname + url.hash, { replaceState: true });
	}

  const initializeFromURL = () => {
		const url = page.url;
	  const gameHash = url.hash.replace('#', '');

	  if (gameHash && gameHash.startsWith('game')) {
		  const gameNumber = +gameHash.replace('game', '');
		  const gameExists = replays?.some(replay => replay.matchNumber === +gameNumber);

		  if (gameExists) {
			  activeTab = 'replay';
			  activeReplay = gameNumber;
		  }
	  } else {
		  activeTab = content ? 'content' : (replays.length > 0 ? 'replay' : 'content');
		  if (replays.length > 0) {
			  activeReplay = replays[0].matchNumber;
		  }
	  }
  };

  initializeFromURL();

</script>

<div class="card md:card-side bg-base-100 transition-shadow">
	<h1 class="text-4xl font-bold mb-2 px-4">
		{primaryUsername(player1)} vs. {primaryUsername(player2)} — {tournament.name} Round {round.roundNumber}
	</h1>
</div>
<div class="card mb-4">
	<div class="card-header px-4">
		<div class="flex justify-between items-center">
			<h3 class="card-title text-lg">
				Hello World
			</h3>
			<div class="tabs w-48">
				<div class="tabs-list grid w-full grid-cols-2">
					<button class="btn btn-style btn-md link-hover"
									tabindex="0"
									disabled={!content}
									aria-label="Toggle to Content section"
									onclick={() => {
                                activeTab = 'content';
                                updateURL('content');
                  }}>
						Content
					</button>
					<button class="btn btn-style btn-md link-hover"
									tabindex="0"
									disabled={replays.length < 1}
									aria-label="Toggle to Replay section"
									onclick={() => {
                                activeTab = 'replay';
                                if (replays.length > 0) {
                                    updateURL('replay', activeReplay);
                                }
                  }}>
						Replay
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="card-content pt-4">
		{#if activeTab === 'content'}
			<div>
				{#if content?.type === 'youtube' && content.url}
					<iframe
						src={'https://www.youtube.com/embed/UGcCU6vR1OQ'}
						title="Match Content"
						class="w-full aspect-video"
						allowFullScreen
					>
					</iframe>
				{:else}
					<p class="text-gray-500">Failed to load content!</p>
				{/if}
			</div>
		{:else if activeTab === 'replay'}
			<div>
				{#if replays.length > 0}
					<div>
						<div class="w-full grid-flow-row {replays.length > 5 ? 'mb-4' : ''}">
							<div class="list grid w-full {gridList}">
								{#each replays as replay}
									<button
										class="btn btn-style btn-md link-hover {activeReplay === replay.matchNumber ? 'btn-active' : ''}"
										onclick={() => {
                                            activeReplay = replay.matchNumber;
                                            updateURL('replay', replay.matchNumber);
                                        }}
										aria-label="Toggle to replay number {replay.matchNumber}"
									>
										Game {replay.matchNumber}
									</button>
								{/each}
							</div>
						</div>

						{#each replays as replay}
							{#if +activeReplay === +replay.matchNumber}
								<ReplayPanel replay={replay} />
							{/if}
						{/each}
					</div>
				{:else}
					<p class="text-gray-500">Failed to load replays!</p>
				{/if}
			</div>
		{/if}
	</div>
</div>