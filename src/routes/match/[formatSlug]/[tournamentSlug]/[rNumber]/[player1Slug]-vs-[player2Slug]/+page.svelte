<script lang="ts">
		import MatchPanel from '$components/match/MatchPanel.svelte';
		import { ChevronsLeftRight } from 'lucide-svelte';
	import { primaryUsername } from '../../../../../../api/playerApi';
		const { data } = $props();
</script>
<svelte:head>
	<title>{data.post.title}</title>
	<meta name="og:title" content={data.post.title}>
	<meta name="og:description" content={data.post.content}>
</svelte:head>

<div class="container mx-auto py-8 px-4">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/tournament">Tournaments</a></li>
			<li><a href="/tournament/{data.tournament.slug}">{data.tournament.name}</a></li>
			<li><a href="/tournament/{data.tournament.slug}/r{data.round.roundNumber}">Round {data.round.roundNumber}</a></li>
			<li>
				<span><a href="/player/{data.player1.psUser}">{primaryUsername(data.player1)}</a></span>
				&nbsp; <span><ChevronsLeftRight color="#999999"/></span> &nbsp;
				<span><a href="/player/{data.player2.psUser}">{primaryUsername(data.player2)}</a></span>
			</li>
		</ul>
	</div>
	<div class="divider"></div>
</div>
<div class="mb-8">
		<MatchPanel
			tournament={data.tournament}
			round={data.round}
			player1={data.player1}
			player2={data.player2}
			replays={data.pairing.replays}
		/>
</div>
