import type { TournamentEntity, TournamentResponse } from '@fullrestore/service/';
import axios, { type AxiosResponse } from "axios";
import { logger, tournamentRepo } from './config.server';
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

export async function searchTournament(searchParam: string, page: number = 1, limit: number = 10): Promise<TournamentResponse[]> {
	try {
		const response: AxiosResponse = await axios.get(`${tournamentRepo.tournamentsUrl}/search_tournament?name=${searchParam}&page=${page}&limit=${limit}`);
		return response.data;
	} catch (error: any) {
		logger.error(
				`FATAL on searchTournament: ${JSON.stringify(error.response?.data || error.message)} ` +
				`| Request: ${tournamentRepo.tournamentsUrl}/search_tournament?name=${searchParam}`
		);
		throw new Error(JSON.stringify(error.response?.data) || error.message);
	}
}