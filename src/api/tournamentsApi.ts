import type { TournamentResponse } from "@fullrestore/fullrestore-service/";
import { tournamentRepo } from './config';
import type { Round } from './roundsApi';

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

export async function loadTournaments(page: number = 1, limit: number = 10): Promise<TournamentResponse[]> {
	return await tournamentRepo.fetchTournaments(page, limit);
}