<script lang="ts">

	const home = '/';
	const tournaments = '/tournaments';
	const formats = '/formats';
	const players = '/players';
	const media = '/media';

</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
			</div>
			<a href="about" class="btn btn-ghost text-xl">Full Restore Tournaments</a>
		</div>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href={home}>Home</a></li>
			<li>
				<details>
					<summary>Tournaments</summary>
					<ul class="p-2">
						<li><a href={tournaments}>All Tournaments</a></li>
						<li><a href="{tournaments}/ongoing">Ongoing</a></li>
						<li><a href="{tournaments}/upcoming">Upcoming</a></li>
						<li><a href="{tournaments}/completed">Completed</a></li>
					</ul>
				</details>
			</li>
			<li><a href={formats}>Formats</a></li>
			<li><a href={players}>Players</a></li>
			<li><a href={media}>Media</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		<input type="text" placeholder="Search..." class="input input-bordered w-24 md:w-auto" />
<!--		<input type="checkbox" value="synthwave" class="toggle theme-controller" />-->
	</div>
</div>