import { loadTournaments, type TournamentQParams } from '../../api/tournamentsApi';
import { loadRounds, type RoundQParams } from '../../api/roundsApi';
import { playerRepo } from '../../api/config';

export const load = async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	const tournamentsResponse = await loadTournaments(page, limit);
	const tournaments: TournamentQParams[] = await Promise.all(tournamentsResponse.map(async (tournament) => {
		const roundsData = await loadRounds(tournament);
		const rounds: RoundQParams[] = roundsData.map((round) => ({
			id: round.id,
			roundNumber: round.round,
			deadline: round.deadline,
			slug: `r${round}`,
		}));
		let winner = undefined;
		if (!!tournament.individual_winner) {
			winner = await playerRepo.findPlayerByAlias(tournament.individual_winner) || undefined;
		}
		return {
			id: tournament.id,
			name: tournament.name,
			season: tournament.season,
			slug: toSlug(tournament.name, tournament.season),
			format: tournament.format,
			rounds,
			startDate: tournament.start_date,
			finishDate: tournament.finish_date || undefined,
			currentRound: tournament.current_round,
			prizePool: tournament.prize_pool,
			individualWinner: winner,
			info: tournament.info || undefined,
			page: page,
			limit: limit,
		};
	}));

	return {
		tournaments,
	};
}

function toSlug(name: string, season: string | number): string {
	return name.toLowerCase().replace(/ /g, '-') +
			(+season === 1 ? '' : '-' + season.toString());
}