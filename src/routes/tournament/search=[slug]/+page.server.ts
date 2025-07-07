import { type TournamentQParams, searchTournament } from '$api/tournamentsApi.server';
import { loadRounds, type RoundQParams } from '$api/roundsApi.server';
import { playerRepo } from '$api/config.server';
import { type TournamentEntity, transformTournamentResponse } from '@fullrestore/service';


export const load = async ({ url, params: params }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	const searchResults = await searchTournament(params.slug);
	const tournaments: TournamentEntity[] = [];
	const foundTournaments: TournamentQParams[] = [];
	for (const result of searchResults) {
		tournaments.push(transformTournamentResponse(result));
	}
	for (const tournament of tournaments) {
		await Promise.all(tournaments.map(async (t) => {
			const roundsData = await loadRounds(tournament);
			const rounds: RoundQParams[] = roundsData.map((round) => ({
				id: round.id,
				roundNumber: round.roundNumber,
				deadline: round.deadline,
				slug: `r${round}`,
			}));
			let winner: string | undefined = undefined;
			if (!!t.individualWinner) {
				const response = await playerRepo.findPlayerByAlias(t.individualWinner.psUser) || undefined;
				winner = response?.psUser;
			}
			foundTournaments.push({
				...t,
				rounds,
				winner,
				pageApi: {
					slug: t.slug,
					page,
					limit
				}} as TournamentQParams);
		}));
	}
	return {
		foundTournaments: foundTournaments,
		slug: params.slug,
		post: {
			title: `Search: Tournament '${params.slug}' - Full Restore`,
			content: ``,
		},
	};
}