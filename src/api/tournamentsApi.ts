import { type TournamentEntity, type TournamentResponse } from "@fullrestore/service/";
import { tournamentRepo } from './config';
import type { PageApi } from './pageApi';
import type { RoundQParams } from './roundsApi';

export type TournamentQParams = TournamentEntity & PageApi & {
	rounds: RoundQParams[],
};

export async function loadTournaments(page: number = 1, limit: number = 10): Promise<TournamentResponse[]> {
	return await tournamentRepo.fetchTournaments(page, limit);
}