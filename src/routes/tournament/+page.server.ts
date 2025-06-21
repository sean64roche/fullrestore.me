import { loadTournaments, type TournamentQParams } from '../../api/tournamentsApi';
import { loadRounds, type RoundQParams } from '../../api/roundsApi';
import { playerRepo } from '../../api/config';

export const load = async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	const tournamentsResponse = await loadTournaments(page, limit);
	const tournaments = await Promise.all(tournamentsResponse.map(async (tournament) => {
		const roundsData = await loadRounds(tournament);
		const rounds: RoundQParams[] = roundsData.map((round) => ({
			id: round.id,
			roundNumber: round.roundNumber,
			deadline: round.deadline,
			slug: `r${round}`,
		}));
		let winner: string | undefined = undefined;
		if (!!tournament.individualWinner) {
			const response = await playerRepo.findPlayerByAlias(tournament.individualWinner.psUser) || undefined;
			winner = response?.psUser;
		}
		return {
			...tournament,
			rounds,
			winner,
			pageApi: {
				slug: tournament.slug,
				page,
				limit,
			}
		} as TournamentQParams;
	}));

	return {
		tournaments,
		post: {
			title: `Tournaments - Full Restore`,
			content: `Tournaments search`,
		}
	};
}