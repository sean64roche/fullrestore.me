import type { TournamentResponse, RoundResponse } from "@fullrestore/fullrestore-service/";
import { tournamentRepo, roundRepo } from '../../api/config';

export async function loadTournaments(page: number = 1, limit: number = 10): Promise<TournamentResponse[]> {
	return await tournamentRepo.fetchTournaments(page, limit);
}

export async function loadRounds(tournament: TournamentResponse): Promise<RoundResponse[]> {
	return await roundRepo.getByTournamentId(tournament.id);
}