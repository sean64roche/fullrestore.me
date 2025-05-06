import { type RoundEntity, type TournamentResponse, type RoundResponse, transformTournamentResponse } from "@fullrestore/fullrestore-service/";
import { roundRepo } from './config';
import type { PageApi } from './pageApi';

export type RoundQParams = Omit<RoundEntity, 'tournament'> & PageApi;

export async function loadRounds(tournament: TournamentResponse): Promise<RoundResponse[]> {
	return await roundRepo.getByTournamentId(tournament.id);
}

export async function loadRound(reqTournament: TournamentResponse, round: number): Promise<RoundEntity> {
	return await roundRepo.get(transformTournamentResponse(reqTournament), round);
}