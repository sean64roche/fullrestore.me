<script lang="ts">
	import type {
		TournamentEntity,
		PlayerEntity,
		RoundEntity,
		ReplayEntity,
		ContentEntity
	} from '@fullrestore/service';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ReplayPanel from '$components/replay/ReplayPanel.svelte';
	import { primaryUsername } from '../../../api/playerApi';
	import { Share2, Braces } from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';

	interface Props {
		tournament: TournamentEntity,
		round: RoundEntity,
		player1: PlayerEntity,
		player2: PlayerEntity,
		replays?: ReplayEntity[],
		content?: ContentEntity[],
	}

	let { tournament, round, player1, player2, replays = [], content }: Props = $props();
	let activeTab = $state('replay');
	let activeReplay: number = $state(1);
	let gridList = !!replays ? getGridClass(replays.length) : 0;
	replays = replays.sort((a, b) => a.matchNumber - b.matchNumber);

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

		goto(url.pathname + url.hash, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
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
<!--			<h3 class="card-title text-lg">-->
<!--			</h3>-->
			<div class="tabs w-70">
				<div class="tabs-list grid w-full grid-cols-[1fr_1fr_0.5fr_0.5fr]">
					<button class="btn btn-style btn-md link-hover {activeTab === 'content' ? 'btn-active' : ''}"
									tabindex="0"
									disabled={!content}
									aria-label="Toggle to Content section"
									onclick={() => {
                                activeTab = 'content';
                                updateURL('content');
                  }}>
						Content
					</button>
					<button class="btn btn-style btn-md link-hover {activeTab === 'replay' ? 'btn-active' : ''}"
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
					<button class="btn btn-style btn-md"
									aria-label="Copy link to clipboard and share"
									onclick={() => {
									navigator.clipboard.writeText(page.url.toString());
									toast.success('Link successfully copied to clipboard');
								}}>
						<Share2 />
					</button>
					<button class="btn btn-style btn-md"
									aria-label="Copy source replay link to clipboard and share"
									disabled={!replays[activeReplay].url}
									onclick={async () => {
										// @ts-ignore
										await navigator.clipboard.writeText(replays[activeReplay].url);
										toast.success('Raw replay URL successfully copied to clipboard');
									}}
					>
						<Braces />
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="card-content pt-4">
		{#if activeTab === 'content'}
			<div class="{activeTab === 'content' ? 'tab-active' : ''}">
				{#if !!content && content[0].content}
					<iframe
						src={content[0].content}
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
			<div class="tab-active">
				{#if replays.length > 0}
					<div>
						<div class="w-full grid-flow-row {replays.length > 5 ? 'mb-4' : ''}">
							<div class="tabs tabs-box list grid w-full {gridList}">
								{#each replays as replay}
									<input
										type="radio" name="my_tabs_1" aria-label="Game {replay.matchNumber}"
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
