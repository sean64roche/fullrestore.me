import type { PlayerEntity, PlayerResponse, PairingResponse, TournamentResponse } from '@fullrestore/service';
import axios, { type AxiosResponse } from "axios";
import { logger, pairingRepo, playerRepo, tournamentRepo } from '$api/config.server';

export type PlayerQParams = Omit<PlayerEntity, 'discordUser' | 'discordId'>;
export type Accolade = {
	tournamentName: string;
	position: number;
}
export async function fetchRecentPlayerMatches(psUser: string, page: number = 1, limit: number = 10): Promise<{ count: number, rows: PairingResponse[] }> {
	try {
		const response: AxiosResponse = await axios.get(`${pairingRepo.pairingsUrl}/recent?player=${psUser}&page=${page}&limit=${limit}`);
		return response.data;
	} catch (error: any) {
		logger.error(
			`FATAL on fetchRecentPlayerMatches: ${JSON.stringify(error.response?.data || error.message)} ` +
			`| Request: ${pairingRepo.pairingsUrl}/playerSearch?player=${psUser}&page=${page}&limit=${limit}`
		);
		throw new Error(JSON.stringify(error.response?.data) || error.message);
	}
}

export async function fetchRecentMatches(page: number = 1, limit: number = 10): Promise<{ count: number, rows: PairingResponse[] }> {
	try {
		const response: AxiosResponse = await axios.get(`${pairingRepo.pairingsUrl}/recent?page=${page}&limit=${limit}`);
		return response.data;
	} catch (error: any) {
		logger.error(
			`FATAL on fetchRecentMatches: ${JSON.stringify(error.response?.data || error.message)} ` +
			`| Request: ${pairingRepo.pairingsUrl}/playerSearch?page=${page}&limit=${limit}`
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

export async function searchPlayer(searchParam: string): Promise<PlayerResponse[]> {
	try {
		const response: AxiosResponse = await axios.get(`${playerRepo.playersUrl}/search_player?player=${searchParam}`);
		return response.data;
	} catch (error: any) {
		logger.error(
			`FATAL on searchPlayer: ${JSON.stringify(error.response?.data || error.message)} ` +
			`| Request: ${playerRepo.playersUrl}/search_player?player=${searchParam}`
		);
		throw new Error(JSON.stringify(error.response?.data) || error.message);
	}
}
