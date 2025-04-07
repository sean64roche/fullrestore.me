<script lang="ts">
	import { ChevronDown, Menu, Search } from 'lucide-svelte';

	const home = '/';
	const tournaments = '/tournaments';
	const formats = '/formats';
	const players = '/players';
	const media = '/media';
</script>

{#snippet items()}
	<li><a href={home}>Home</a></li>
	<li>
		<div class="block lg:hidden">
			<a href={tournaments} class="font-bold">Tournaments</a>
			<ul class="pl-4 bg-base-100 p-2 list-disc">
				<li><a href={tournaments}>All Tournaments</a></li>
				<li><a href="{tournaments}/ongoing">Ongoing</a></li>
				<li><a href="{tournaments}/upcoming">Upcoming</a></li>
				<li><a href="{tournaments}/completed">Completed</a></li>
			</ul>
		</div>
		<div class="dropdown dropdown-center dropdown-hover hidden lg:block">
			<a href={tournaments} tabindex="0" class="inline-flex items-center gap-1">
				Tournaments <ChevronDown class="w-4 h-4" />
			</a>
			<ul tabindex="-1" class="dropdown-content menu bg-base-100 p-2 list-disc">
				<li><a href={tournaments}>All Tournaments</a></li>
				<li><a href="{tournaments}/ongoing">Ongoing</a></li>
				<li><a href="{tournaments}/upcoming">Upcoming</a></li>
				<li><a href="{tournaments}/completed">Completed</a></li>
			</ul>
		</div>
	</li>
	<li><a href={formats}>Formats</a></li>
	<li><a href={players}>Players</a></li>
	<li><a href={media}>Media</a></li>
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
				<a href="/" class="btn btn-ghost text-xl">Full Restore Tournaments</a>
			</div>
		</div>
	</div>
	<div class="dropdown">

	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="dropdown-content menu menu-horizontal px-1">
			{@render items()}
		</ul>
	</div>
	<div class="navbar-end hidden md:flex lg:flex">
		<label class="input">
			<Search class="w-4 h-4" />
			<input type="search" class="grow" required placeholder="Search" />
		</label>
	</div>
</div>