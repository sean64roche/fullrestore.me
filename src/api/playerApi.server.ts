import type { PlayerEntity, PairingResponse, TournamentResponse } from '@fullrestore/service';
import axios, { type AxiosResponse } from "axios";
import { logger, pairingRepo, tournamentRepo } from '$api/config.server';

export type PlayerQParams = Omit<PlayerEntity, 'discordUser' | 'discordId'>;
export type Accolade = {
	tournamentName: string;
	position: number;
}
export async function fetchPairingsByUsername(psUser: string, page: number = 1, limit: number = 10): Promise<PairingResponse[]> {
	try {
		const response: AxiosResponse = await axios.get(`${pairingRepo.pairingsUrl}/playerSearch?player=${psUser}&page=${page}&limit=${limit}`);
		return response.data;
	} catch (error: any) {
		logger.error(
				`FATAL on fetchPairingsByUsername: ${JSON.stringify(error.response?.data || error.message)} ` +
				`| Request: ${pairingRepo.pairingsUrl}/playerSearch?player=${psUser}&page=${page}&limit=${limit}`
		);
		throw new Error(JSON.stringify(error.response?.data) || error.message);
	}
}

export async function fetchAccolades(playerId: string): Promise<TournamentResponse[]> {
	try {
		const response: AxiosResponse = await axios.get(`${tournamentRepo.tournamentsUrl}?individual_winner=${playerId}`);
		return response.data;
	} catch (error: any) {
		logger.error(
				`FATAL on fetchAccolades: ${JSON.stringify(error.response?.data || error.message)} ` +
				`| Request: ${tournamentRepo.tournamentsUrl}?individual_winner=${playerId}`
		);
		throw new Error(JSON.stringify(error.response?.data) || error.message);
	}
}