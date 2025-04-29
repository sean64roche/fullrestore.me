import type { TournamentResponse, RoundResponse } from "@fullrestore/fullrestore-service/";
import { tournamentRepo, roundRepo } from '../api/config';

export interface Tournament {
	id: string,
	name: string;
	season: string | number;
	slug: string;
	format: string,
	rounds: Round[],
	startDate: string,
	finishDate?: string,
	individualWinner?: string,
	info?: string,
}
export interface Round {
	id: string,
	number: number,
	deadline?: string,
}

export async function loadTournaments(page: number = 1, limit: number = 10): Promise<TournamentResponse[]> {
	return await tournamentRepo.fetchTournaments(page, limit);
}

export async function loadRounds(tournament: TournamentResponse): Promise<RoundResponse[]> {
	return await roundRepo.getByTournamentId(tournament.id);
}