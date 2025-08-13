import { type TournamentQParams, searchTournament } from '$api/tournamentsApi.server';
import { loadRounds, type RoundQParams } from '$api/roundsApi.server';
import { playerRepo } from '$api/config.server';
import { type TournamentEntity, transformTournamentResponse } from '@fullrestore/service';


export const load = async ({ url }) => {
	const query = String(url.searchParams.get('query'));
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	const searchResults = await searchTournament(query, page, limit);
	console.log(`Number of tournaments found: ${searchResults.count}`);
	const tournaments: TournamentEntity[] = [];
	const foundTournaments: TournamentQParams[] = [];
	for (const result of searchResults.rows) {
		tournaments.push(transformTournamentResponse(result));
		console.log(`Adding tournament '${result.slug}'`);
	}
	for (const tournament of tournaments) {
		const roundsData = await loadRounds(tournament);
		const rounds: RoundQParams[] = roundsData.map((round) => ({
			id: round.id,
			roundNumber: round.roundNumber,
			deadline: round.deadline,
			slug: `r${round}`,
		}));
		let winner: string | undefined = undefined;
		if (!!tournament.individualWinner) {
			const response = await playerRepo.findPlayer(tournament.individualWinner.psUser) || undefined;
			winner = response?.psUser;
		}
		foundTournaments.push({
			...tournament,
			rounds,
			winner,
			pageApi: {
				slug: tournament.slug,
				page,
				limit
			}} as TournamentQParams);
	}
	return {
		foundTournaments: foundTournaments,
		slug: query,
		count: searchResults.count,
		post: {
			title: `Search: Tournament '${query}' - Full Restore`,
			content: ``,
		},
	};
}
