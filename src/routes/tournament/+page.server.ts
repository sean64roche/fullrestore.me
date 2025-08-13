import { searchTournament, type TournamentQParams } from '$api/tournamentsApi.server';
import { loadRounds, type RoundQParams } from '$api/roundsApi.server';
import { playerRepo } from '$api/config.server';
import { compareDesc } from 'date-fns';
import { transformTournamentResponse } from '@fullrestore/service';

export const load = async ({ url }) => {
	const page = Number(url.searchParams.get('recentTournaments') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	const tournamentsResponse = await searchTournament('', page, limit);
	const tournaments = await Promise.all(tournamentsResponse.rows.map(async (tournament) => {
		const tournamentEntity = transformTournamentResponse(tournament);
		const roundsData = await loadRounds(tournamentEntity);
		const rounds: RoundQParams[] = roundsData.map((round) => ({
			id: round.id,
			roundNumber: round.roundNumber,
			deadline: round.deadline,
			slug: `r${round}`,
		}));
		let winner: string | undefined = undefined;
		if (!!tournamentEntity.individualWinner) {
			const response = await playerRepo.findPlayer(tournamentEntity.individualWinner.psUser) || undefined;
			winner = response?.psUser;
		}
		return {
			...tournamentEntity,
			rounds,
			winner,
			pageApi: {
				slug: tournament.slug,
				page,
				limit,
			}
		} as TournamentQParams;
	}));
	tournaments.sort((a, b) => compareDesc(a.startDate, b.startDate));

	return {
		tournaments,
		count: tournamentsResponse.count,
		post: {
			title: `Tournaments - Full Restore`,
			content: `Tournaments search`,
		}
	};
}
