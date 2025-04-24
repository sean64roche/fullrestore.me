import { loadRounds, loadTournaments } from '../../server/tournament/tournamentsApi';

export interface Tournament {
	id: string,
	name: string;
	slug: string;
	format: string,
	rounds: Round[],
	startDate: Date,
	endDate?: Date,
	individualWinner?: string
}
export interface Round {
	id: string,
	number: number,
	deadline?: string,
}

export const load = async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 10);

	const tournamentsResponse = await loadTournaments(page, limit);
	const tournaments: Tournament[] = await Promise.all(tournamentsResponse.map(async (tournament) => {
		const roundsData = await loadRounds(tournament);
		const rounds: Round[] = roundsData.map((round) => ({
			id: round.id,
			number: round.round,
			deadline: round.deadline
		}));
		return {
			id: tournament.id,
			name: tournament.name,
			slug: toSlug(tournament.name, tournament.season),
			format: tournament.format,
			rounds,
			startDate: new Date(Date.now()),
			endDate: undefined,
			individualWinner: tournament.individual_winner || undefined,
		};
	}));

	return {
		tournaments,
	};
}

function toSlug(name: string, season: string | number): string {
	return name.toLowerCase().replace(/ /g, '-') + '-' + season.toString();
}