<script lang="ts">
	import "../app.css";
	import { CalendarClock, Medal, Rss, Swords, TvMinimalPlay } from "lucide-svelte";
  import RecentGames from '$components/home/RecentGames.svelte';

  const { data } = $props();

</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<main class="max-w-4xl mx-auto px-4 space-y-12 py-8">

	<section class="hero-gradient hero-pattern rounded-2xl shadow-xl overflow-hidden relative">
		<p class="text-lg text-center text-gray-700 max-w-xl mx-auto flex items-center justify-center p-2">
			<Medal class="shrink-0 p-0" />Explore Pokémon Showdown matches through tournaments, formats, stats, players and teams.<Medal class="shrink-0 p-0" />
		</p>
	</section>

	<section>
		<h2 class="text-2xl font-semibold mb-2 inline-flex gap-2"><CalendarClock />Upcoming Tournaments</h2>
		<ul class="space-y-2">
			<li class="border border-black rounded p-4 shadow-sm bg-base-200">
				<strong>Old Money Open 2</strong><br>
				<small>Starts: Monday 23 June, 2025 · Format: Gen 3 OU</small>
			</li>
			<li class="border border-black rounded p-4 shadow-sm bg-base-200">
				<strong>ADV Revival Draft</strong><br>
				<small>Starts: Monday 30 June, 2025 · Format: Gen 3 Draft</small><br>
				<small><a href="https://forms.gle/aXktx7esZnJHDFoU8" class="link-hover">Click here to sign up</a></small>
			</li>
		</ul>
	</section>

	<section>
		<h2 class="text-2xl font-semibold mb-2 inline-flex gap-2"><TvMinimalPlay/>Upcoming Matches</h2>
		<p class="text-gray-500 italic">No upcoming matches for now. Check back again soon</p>
	</section>

	<section>
		<h2 class="text-2xl font-semibold mb-2 inline-flex gap-2"><Swords/>Recent Games</h2>
		<ul class="space-y-2">
			{#each data.pairings as pairing}
				<li class="border border-black rounded p-4 shadow-sm bg-base-200">
					<RecentGames pairing={pairing}/>
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="text-2xl font-semibold mb-2 inline-flex gap-2"><Rss/>Site Updates</h2>
		<ul class="list-disc list-inside space-y-1">
			<li><strong>Monday 2 June, 2025:</strong> We're online!</li>
		</ul>
	</section>

</main>

<style>
    .hero-gradient {
        background: linear-gradient(135deg, #35ba32 0%, #ebe9ac 100%);
    }

</style>