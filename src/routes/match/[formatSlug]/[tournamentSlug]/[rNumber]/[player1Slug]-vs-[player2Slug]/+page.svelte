<script lang="ts">
	import MatchPanel from '$components/match/MatchPanel.svelte';
	import { ChevronsLeftRight } from 'lucide-svelte';
  import { browser } from '$app/environment';

	const { data } = $props();

	let currentView = $state(browser ? (localStorage.getItem('defaultView') ?? 'content') : 'content');

</script>
<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<main class="mx-auto lg:px-4 space-y-12 py-8">
	<section>
		<div class="breadcrumbs text-sm">
			<ul>
				<li><a href="/tournament">Tournaments</a></li>
				<li><a href="/tournament/{data.tournament.slug}">{data.tournament.name}</a></li>
				<li><a href="/tournament/{data.tournament.slug}/r{data.round.roundNumber}">Round {data.round.roundNumber}</a></li>
				<li>
					<span><a href="/player/{data.player1.psUser}">{data.player1.username}</a></span>
					&nbsp; <span><ChevronsLeftRight color="#999999"/></span> &nbsp;
					<span><a href="/player/{data.player2.psUser}">{data.player2.username}</a></span>
				</li>
			</ul>
		</div>
		<div class="divider"></div>
	</section>

	<section>
		<MatchPanel
			tournament={data.tournament}
			round={data.round}
			player1={data.player1}
			player2={data.player2}
			replays={data.pairing.replays}
			content={data.pairing.content}
			defaultView={currentView}
		/>
	</section>
</main>

