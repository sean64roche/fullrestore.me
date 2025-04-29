import type { TournamentResponse, RoundResponse } from "@fullrestore/fullrestore-service/";
import { roundRepo } from './config';

export interface Round {
	id: string,
	number: number,
	deadline?: string,
}

export async function loadRounds(tournament: TournamentResponse): Promise<RoundResponse[]> {
	return await roundRepo.getByTournamentId(tournament.id);
}