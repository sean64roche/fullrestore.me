<script lang="ts">
	import { ChevronDown, Menu, Search, Settings } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const home = '/';
	const tournament = '/tournament';
	const format = '/format';
	const player = '/player';
	const media = '/media';
	const userSettings = '/user-settings';

	let currentTheme = $state('acid');
	let defaultMatchView = $state('content');

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');
		const storedView = localStorage.getItem('defaultView');
		if (storedView) defaultMatchView = storedView;
		if (storedTheme) {
			currentTheme = storedTheme;
			document.documentElement.setAttribute('data-theme', currentTheme);
		} else {
			document.documentElement.setAttribute('data-theme', currentTheme);
			localStorage.setItem('theme', currentTheme);
		}

	});

	function toggleTheme() {
		currentTheme = currentTheme === 'acid' ? 'dracula' : 'acid';
		document.documentElement.setAttribute('data-theme', currentTheme);
		localStorage.setItem('theme', currentTheme);
	}

	function toggleDefaultMatchView() {
		defaultMatchView = defaultMatchView === 'replay' ? 'content' : 'replay';
		localStorage.setItem('defaultView', defaultMatchView);
	}
</script>

{#snippet items()}
	<div class="block lg:hidden">
		<div class="font-bold">Tournaments</div>
		<ul class="pl-4 bg-base-100 p-2 list-disc">
			<li><a href={tournament} class="btn btn-ghost font-normal">All Tournaments</a></li>
			<li><a href="{tournament}/-/ongoing" class="btn btn-ghost font-normal align">Ongoing</a></li>
			<li><a href="{tournament}/-/upcoming" class="btn btn-ghost font-normal">Upcoming</a></li>
			<li><a href="{tournament}/-/completed" class="btn btn-ghost font-normal">Completed</a></li>
		</ul>
	</div>
	<li class="dropdown dropdown-center hidden lg:block">
		<button tabindex="0" class="inline-flex items-center gap-1 btn btn-ghost font-normal">
			Tournaments
			<ChevronDown class="w-4 h-4" />
		</button>
		<ul tabindex="-1" class="dropdown-content menu bg-base-100 p-2 list-disc">
			<li><a href={tournament} class="btn btn-ghost font-normal">All Tournaments</a></li>
			<li><a href="{tournament}/-/ongoing" class="btn btn-ghost font-normal">Ongoing</a></li>
			<li><a href="{tournament}/-/upcoming" class="btn btn-ghost font-normal">Upcoming</a></li>
			<li><a href="{tournament}/-/completed" class="btn btn-ghost font-normal">Completed</a></li>
		</ul>
	</li>
	<li><a href={player} class="btn btn-ghost font-normal">Players</a></li>
	<li><a href={format} class="btn btn-ghost font-normal">Formats</a></li>
	<li><a href={media} class="btn btn-ghost font-normal">Media</a></li>
	<li class="dropdown dropdown-center hidden lg:block">
		<button tabindex="0" class="inline-flex items-center gap-1 btn btn-ghost font-normal">
			Settings
			<Settings class="w-4 h-4" />
		</button>
		<ul tabindex="-1" class="dropdown-content menu bg-base-100 p-2 list-disc font-normal min-w-max">
			<li>
				<label class="outline-1 outline-base-300 cursor-pointer gap-2 mb-2 grid grid-cols-[1fr_auto_1fr] items-center whitespace-nowrap">
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
				<label class="outline-1 outline-base-300 cursor-pointer gap-2 mb-2 grid grid-cols-[1fr_auto_1fr] items-center whitespace-nowrap">
					<span class="label-text">Default to Replay</span>
					<input
						type="checkbox"
						onchange={toggleDefaultMatchView}
						checked={defaultMatchView === 'content'}
						class="toggle"
					/>
					<span class="label-text">Default to Content</span>
				</label>
			</li>
		</ul>
	</li>
{/snippet}

<div class="navbar bg-base-100 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div class="navbar bg-base-100 shadow-sm">
				<details class="dropdown">
					<summary class="btn btn-ghost btn-circle lg:hidden m-1">
						<Menu />
					</summary>
					<ul class="dropdown-content menu bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
						{@render items()}
					</ul>
				</details>
				<a href="/" class="text-xl link-hover">Full Restore Tournaments</a>
			</div>
		</div>
	</div>
	<div class="dropdown">

	</div>
	<div class="navbar-center hidden lg:flex">
		<div class="dropdown-content menu menu-horizontal px-1">
			{@render items()}
		</div>
	</div>
	<div class="navbar-end hidden md:flex lg:flex">
		<label class="input">
			<Search class="w-4 h-4" />
			<input type="search" class="grow" placeholder="Search" disabled={true} />
		</label>
	</div>
</div>