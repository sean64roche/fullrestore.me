<script lang="ts">
	import type {
		TournamentEntity,
		PlayerEntity,
		RoundEntity,
		ReplayEntity,
		ContentEntity
	} from '@fullrestore/service';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ReplayPanel from '$components/replay/ReplayPanel.svelte';
	import { Share2, Braces } from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import { browser } from '$app/environment';
  import { fade } from 'svelte/transition';
  import { error } from '@sveltejs/kit';

	interface Props {
		tournament: TournamentEntity,
		round: RoundEntity,
		player1: PlayerEntity,
		player2: PlayerEntity,
		replays?: ReplayEntity[],
		content?: ContentEntity[],
		defaultView: string,
	}

	let { tournament, round, player1, player2, replays = [], content = [], defaultView }: Props = $props();
	let activeTab = $state('replay');
	let rawReplayButtonBehaviour = $state('_self');
	let activeReplay: number = $state(1);
	let gridList = !!replays ? getGridClass(replays.length) : 0;
	replays = replays.sort((a, b) => a.matchNumber - b.matchNumber);

  onMount(() => {
	  const storedTarget = localStorage.getItem('defaultMatchNewTab');
	  if (storedTarget) {
		rawReplayButtonBehaviour = storedTarget;
	  }
  });
  const getYouTubeId = (url: string) => {
		const match = url.match(/(?:^|\/|v=)([a-zA-Z0-9_-]{11})(?:[^a-zA-Z0-9_-]|$)/);
		return match ? match[1] : null;
	};

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
			url.hash = 'content';
		}

		goto(url.pathname + url.hash, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	const initializeFromURL = () => {
	  if (!browser) return;

	  const url = page.url;
	  const gameHash = url.hash.replace('#', '');
	  const isGameHash = gameHash.startsWith('game');
	  const isContentHash = gameHash.startsWith('content');
	  const defaultIsContent = defaultView === 'content';
	  if (isGameHash) {
		  const gameNumber = +gameHash.replace('game', '');
		  setTabWithFallback('replay', gameNumber);
	  } else if (isContentHash || (defaultIsContent && !!content[0])) {
			setTabWithFallback('content');
	  } else { // default is replay, link is available, send them to g1
		  setTabWithFallback('replay', 1);
	  }
	};

  const setTabWithFallback = (tab: 'replay' | 'content', gameNumber = 1) => {
	  const replayExists = replays?.some(replay => replay.matchNumber === gameNumber);
	  const contentExists = content[0];
	  if (tab === 'replay') {
		  if (replayExists) {
			  activeTab = 'replay';
			  activeReplay = gameNumber;
			  updateURL('replay', gameNumber);
		  } else if (replays?.some(replay => replay.matchNumber === 1)) {
			  activeTab = 'replay';
			  activeReplay = 1;
			  updateURL('replay', 1);
		  } else if (contentExists) {
			  activeTab = 'content';
			  updateURL('content');
		  } else {
			  error(404, 'Not found');
		  }
	  } else {
		  if (contentExists) {
			  activeTab = 'content';
			  updateURL('content');
		  } else if (replays?.some(replay => replay.matchNumber === 1)) {
			  activeTab = 'replay';
			  activeReplay = 1;
			  updateURL('replay', 1);
		  } else {
			  error(404, 'Not found');
		  }
	  }

	  if (tab === 'replay' && replayExists) {
	  } else if (contentExists) {
		  activeTab = 'content';
		  updateURL('content');
	  } else {
		  error(404, 'Not found');
	  }
  };

	initializeFromURL();

</script>

<div class="card">
	<div class="card-header px-4">
		<div class="flex justify-between items-center">
			<div class="align-text-bottom text-center">
				<h1 class="text-2xl font-bold px-4">
					{player1.username} vs. {player2.username}
				</h1>
				<small class="text-gray-500 px-4">
					{tournament.name}, Round {round.roundNumber}
				</small>
			</div>
			<div class="tabs w-80">
				<div class="tabs-list w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
					<button class="btn btn-style link-hover {activeTab === 'content' ? 'btn-active' : ''}"
									tabindex="0"
									disabled={!content || content.length < 1}
									aria-label="Toggle to Content section"
									onclick={() => {
                                activeTab = 'content';
                                updateURL('content');
                  }}>
						Content
					</button>
					<button class="btn btn-style link-hover {activeTab === 'replay' ? 'btn-active' : ''}"
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
					<button class="btn btn-style"
									aria-label="Copy link to clipboard and share"
									onclick={() => {
									navigator.clipboard.writeText(page.url.toString());
									toast.success('Link successfully copied to clipboard');
								}}>
						<Share2 class="min-w-6 max-w-6 min-h-6 max-h-6" viewBox="0 0 24 24" />
					</button>
					<button class="btn btn-style"
									aria-label="Copy source replay link to clipboard and share"
									disabled={!replays[activeReplay - 1] || activeTab === 'content'}
									onclick={async () => {
										if (rawReplayButtonBehaviour === '_blank') {
											for (const replay of replays) {
												window.open(replay.url);
											}
										}
										// @ts-ignore
										await navigator.clipboard.writeText(replays.map(
											(replay) => replay.url
											).join('\n'));
										toast.success('Raw replay URLs successfully copied to clipboard');
									}}
					>
						<Braces class="min-w-6 max-w-6 min-h-6 max-h-6" viewBox="0 0 24 24" />
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="card-content pt-4 sm:px-0 md:px-4">
		{#if activeTab === 'content'}
			<div class="{activeTab === 'content' ? 'tab-active' : ''} flex justify-center px-4">
				{#if content[0]}
					<div in:fade out:fade class="aspect-video w-full max-w-4xl mx-auto ">
						<iframe
							class="w-full h-full"
							src="https://www.youtube.com/embed/{getYouTubeId(content[0].url)}"
							title="Match Content"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						>
						</iframe>
					</div>
				{:else}
					<p class="text-gray-500">Failed to load content!</p>
				{/if}
			</div>
		{:else if activeTab === 'replay'}
			<div class="tab-active">
				{#if replays.length > 0}
					<div>
						<div class="w-full grid-flow-row {replays.length > 5 ? 'mb-4' : ''}">
							<div class="tabs tabs-box list grid w-full {gridList}">
								{#each replays as replay}
									<input
										type="radio" name="my_tabs_1"
										aria-label="Game {replay.matchNumber}"
										class="tab link-hover {activeReplay === replay.matchNumber ? 'tab-active' : ''}"
										onclick={() => {
                      activeReplay = replay.matchNumber;
                      updateURL('replay', replay.matchNumber);
                    }}
									/>
								{/each}
							</div>
						</div>

						{#each replays as replay}
							<div class="replay-panel" style="display: {+activeReplay === +replay.matchNumber ? 'block' : 'none'}">
								<ReplayPanel replay={replay} />
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500">Failed to load replays!</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<Toaster position="top-right" expand={true} richColors />
