import type { TournamentEntity } from '@fullrestore/service/';
import { tournamentRepo } from './config.server';
import type { PageApi } from './pageApi.server';
import type { RoundQParams } from './roundsApi.server';

export type TournamentQParams = TournamentEntity & {
	rounds: RoundQParams[],
	winner: string,
	pageApi: PageApi,
};

export async function loadTournaments(page: number = 1, limit: number = 10): Promise<TournamentEntity[]> {
	return await tournamentRepo.fetchTournaments(page, limit);
}