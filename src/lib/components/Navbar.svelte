<script lang="ts">
	import { ChevronDown, Menu, Search, Settings } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';

	const tournamentPath = '/tournament';
	const formatPath = '/format';
	const playerPath = '/player';
	const mediaPath = '/media';

	let menuDropdownOpen = $state(false);
	let playerDropdownOpen = $state(false);
	let playerDropDownValue = $state('');
	let tournamentDropdownOpen = $state(false);
	let tournamentDropDownValue = $state('');

	let playerSearchInput: HTMLInputElement | null = $state(null);
	let tournamentSearchInput: HTMLInputElement | null = $state(null);

	let currentTheme = $state('acid');
	let defaultMatchView = $state('replay');
	let defaultMatchTab = $state('_self');
	let defaultShowWinners = $state('false');

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');
		const storedView = localStorage.getItem('defaultView');
		const storedMatchNewTab = localStorage.getItem('defaultMatchNewTab');
		const storedShowWinners = localStorage.getItem('showWinners');

		if (storedView) defaultMatchView = storedView;
		if (storedMatchNewTab) defaultMatchTab = storedMatchNewTab;
		if (storedShowWinners) defaultShowWinners = storedShowWinners;
		if (storedTheme) {
			currentTheme = storedTheme;
			document.documentElement.setAttribute('data-theme', currentTheme);
		} else {
			document.documentElement.setAttribute('data-theme', currentTheme);
			localStorage.setItem('theme', currentTheme);
		}
		const close = (e: MouseEvent) => {
			if (!(e.target as HTMLElement)?.closest('.menu-dropdown')) {
				menuDropdownOpen = false;
			}
			if (!(e.target as HTMLElement)?.closest('.player-dropdown')) {
				playerDropdownOpen = false;
			}
			if (!(e.target as HTMLElement)?.closest('.tournament-dropdown')) {
				tournamentDropdownOpen = false;
			}
		};
		document.addEventListener('click', close);
		return () => document.removeEventListener('click', close);
	});

	function toggleTheme() {
		currentTheme = currentTheme === 'acid' ? 'dracula' : 'acid';
		document.documentElement.setAttribute('data-theme', currentTheme);
		localStorage.setItem('theme', currentTheme);
	}

	function toggleDefaultMatchView() {
		defaultMatchView = defaultMatchView === 'replay' ? 'content' : 'replay';
		localStorage.setItem('defaultView', defaultMatchView);
		document.documentElement.setAttribute('defaultView', defaultMatchView);
	}

	function toggleDefaultMatchTab() {
		defaultMatchTab = defaultMatchTab === '_self' ? '_blank' : '_self';
		localStorage.setItem('defaultMatchNewTab', defaultMatchTab);
		location.reload();
	}

	function toggleDisplayWinner() {
		defaultShowWinners = defaultShowWinners === 'true' ? 'false' : 'true';
		localStorage.setItem('showWinners', defaultShowWinners);
		location.reload();
	}

	function acceptSearch(path: string, param: string) {
		goto(`${path}/search${param}`);
	}

</script>

{#snippet tournamentMenu()}
	<a
		href={tournamentPath}
		class="btn btn-ghost font-normal link-hover justify-start w-full"
	>
		Recent Tournaments
	</a>

	<div>
		<label class="input flex items-center gap-2">
			<Search class="w-4 h-4" />
			<input
				bind:this={tournamentSearchInput}
				bind:value={tournamentDropDownValue}
				type="search"
				class="grow"
				id="searchTournaments"
				placeholder="Search tournaments..."
				onkeydown={(e) => {
					if (e.key === "Enter") {
						acceptSearch(tournamentPath, "?query=" + tournamentDropDownValue + "&page=1");
						tournamentDropdownOpen = false;
						tournamentDropDownValue = '';
				}}}
			/>
		</label>
	</div>
{/snippet}

{#snippet playerMenu()}
	<div class="inline-flex items-center">
		<label class="input">
			<Search class="w-4 h-4" />
			<input
				bind:this={playerSearchInput}
				bind:value={playerDropDownValue}
				type="search"
				class="grow"
				id="searchPlayers"
				placeholder="Search players..."
				onkeydown={(e) => {
					if (e.key === "Enter") {
						acceptSearch(playerPath, "=" + playerDropDownValue);
						playerDropdownOpen = false;
						playerDropDownValue = '';
				}}}
			/>
		</label>
	</div>
{/snippet}

{#snippet items()}
	<div class="block lg:hidden">
		<div class="font-bold">Tournaments</div>
		<ul class="pl-4 bg-base-100 p-2 list-disc">
			{@render tournamentMenu()}
		</ul>
		<div class="font-bold">Players</div>
		<ul class="pl-4 bg-base-100 p-2 list-disc">
			{@render playerMenu()}
		</ul>
	</div>
	<li class="relative hidden lg:block tournament-dropdown">
		<button
			class="btn btn-ghost font-normal text-left flex items-center gap-1"
			onclick={async () => {
			tournamentDropdownOpen = !tournamentDropdownOpen;
			if (tournamentDropdownOpen) {
				await tick();
				requestAnimationFrame(() => {
					tournamentSearchInput?.focus();
				});
			}
		}}
		>
			Tournaments
			<ChevronDown class="w-4 h-4" />
		</button>
		{#if tournamentDropdownOpen}
			<div class="absolute z-50 mt-2 flex flex-col gap-2 bg-base-100 p-2 min-w-max rounded-box shadow">
				{@render tournamentMenu()}
			</div>
		{/if}
	</li>

	<li class="relative hidden lg:block player-dropdown">
		<button
			class="btn btn-ghost font-normal text-left flex items-center gap-1"
			onclick={async () => {
			playerDropdownOpen = !playerDropdownOpen;
			if (playerDropdownOpen) {
				await tick();
				requestAnimationFrame(() => {
					playerSearchInput?.focus();
				});
			}
		}}
		>
			Players
			<ChevronDown class="w-4 h-4" />
		</button>
		{#if playerDropdownOpen}
			<div class="absolute z-50 mt-2 bg-base-100 p-2 list-disc min-w-max rounded-box shadow">
				{@render playerMenu()}
			</div>
		{/if}
	</li>

	<li class="tooltip lg:tooltip-bottom tooltip-right" data-tip="Coming Soon">
		<button class="btn btn-ghost font-bold lg:font-normal text-left pointer-events-none" disabled={true}>
			Teams
		</button>
	</li>
	<li class="tooltip lg:tooltip-bottom tooltip-right">
		<a href={formatPath}
			 class="btn btn-ghost font-bold lg:font-normal link-hover justify-start w-full">
			Formats
		</a>
	</li>
	<li class="tooltip lg:tooltip-bottom tooltip-right" data-tip="Coming Soon">
		<button class="btn btn-ghost font-bold lg:font-normal text-left pointer-events-none" disabled={true}>
			Media
		</button>
	</li>
	<li class="dropdown dropdown-center hidden lg:block">
		{@render settings()}
	</li>
{/snippet}

{#snippet settings()}
	<button tabindex="0" class="inline-flex items-center gap-1 btn btn-ghost font-normal">
		<span class="lg:block hidden">Settings</span>
		<Settings class="w-4 h-4" />
	</button>
	<ul tabindex="-1" class="dropdown-content menu bg-base-100 p-2 list-disc font-normal min-w-max rounded-box float-end">
		<li>
			<label
				class="outline-1 outline-base-300 cursor-pointer gap-2 mb-2 grid grid-cols-[1fr_auto_1fr]  whitespace-nowrap">
				<span class="label-text text-right">Light</span>
				<input
					type="checkbox"
					onchange={toggleTheme}
					checked={currentTheme === 'dracula'}
					class="toggle theme-controller"
				/>
				<span class="label-text text-left">Dark</span>
			</label>
		</li>
		<li>
			<label
				class="outline-1 outline-base-300 cursor-pointer gap-2 mb-2 grid grid-cols-[1fr_auto_1fr] items-center whitespace-nowrap">
				<span class="label-text text-right">Default to Replay</span>
				<input
					type="checkbox"
					onchange={toggleDefaultMatchView}
					checked={defaultMatchView === 'content'}
					class="toggle"
				/>
				<span class="label-text text-left">Default to Content</span>
			</label>
		</li>
		<li>
			<label
				class="outline-1 outline-base-300 cursor-pointer gap-2 mb-2 grid grid-cols-[1fr_auto_1fr] items-center whitespace-nowrap">
				<span class="label-text text-right">Open match in<br>current tab</span>
				<input
					type="checkbox"
					onchange={toggleDefaultMatchTab}
					checked={defaultMatchTab === "_blank"}
					class="toggle"
				/>
				<span class="label-text text-left">Open match in<br>new tab</span>
			</label>
		</li>
		<li>
			<label
				class="outline-1 outline-base-300 cursor-pointer gap-2 mb-2 grid grid-cols-[1fr_auto_1fr] items-center whitespace-nowrap">
				<span class="label-text text-right">Hide winners</span>
				<input
					type="checkbox"
					onchange={toggleDisplayWinner}
					checked={defaultShowWinners === 'true'}
					class="toggle"
				/>
				<span class="label-text text-left">Reveal winners</span>
			</label>
		</li>
	</ul>
{/snippet}

<div class="navbar bg-base-100 shadow-sm items-center">
	<div class="navbar-start flex items-center gap-2 w-full grow">
		<div class="dropdown menu-dropdown">
			<button class="btn btn-ghost btn-circle lg:hidden" onclick={() => {menuDropdownOpen = !menuDropdownOpen}}>
				<Menu />
			</button>
			{#if menuDropdownOpen}
				<ul class="dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
					{@render items()}
				</ul>
			{/if}
		</div>
		<a href="/">
			<ul
				class="bg-base-200 border border-black rounded shadow-sm w-auto p-2 flex items-center gap-2 hover:bg-base-300">
				<li class="shrink-0 p-0">
					<img
						src="/favicon.png"
						alt="Full Restore tournaments Logo"
						class="h-10 w-auto object-contain"
					>
				</li>
				<li>
					<div class="text-xl pl-2 pr-2">
						Full Restore Tournaments
					</div>
				</li>
			</ul>
		</a>
	</div>
	<div class="dropdown">

	</div>
	<div class="navbar-center hidden lg:flex flex-1 justify-center">
		<div class="dropdown-content menu-horizontal px-1">
			{@render items()}
		</div>
	</div>
	<div class="navbar-end flex items-center gap-2 w-1/4 lg:w-full">
		<div class="dropdown menu lg:dropdown-center lg:hidden block dropdown-end">
			{@render settings()}
		</div>
	</div>
</div>
