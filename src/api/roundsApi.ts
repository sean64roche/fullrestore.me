import type { RoundEntity, TournamentEntity } from '@fullrestore/service/';
import { roundRepo } from './config';
import type { PageApi } from './pageApi';

export type RoundQParams = Omit<RoundEntity, 'tournament'> & PageApi;

export async function loadRounds(tournament: TournamentEntity): Promise<RoundEntity[]> {
	return await roundRepo.getByTournamentSlug(tournament.slug);
}

export async function loadRound(reqTournament: TournamentEntity, round: number): Promise<RoundEntity> {
	return await roundRepo.get(reqTournament, round);
}