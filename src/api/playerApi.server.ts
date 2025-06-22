import type { PlayerEntity, PairingResponse } from '@fullrestore/service';
import axios, { type AxiosResponse } from "axios";
import { logger, pairingRepo } from '$api/config.server';

export type PlayerQParams = Omit<PlayerEntity, 'discordUser' | 'discordId'>;

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
