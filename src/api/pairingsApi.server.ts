import { playerRepo } from './config.server';
import type { PairingEntity, EntrantPlayerEntity, EntrantPlayerResultEntity } from '@fullrestore/service';

export interface Pairing {
	id: string,
}

export type ReplayQParams = {
	id: string,
	url: string,
	matchNumber: number,
	datePlayed: string,
}

export type ContentQParams = {
	id: string,
	url: string,
	type: string,
}

export async function calcEntrantPlayerScores(pairings: PairingEntity[], roundNumber: number): Promise<Map<string, EntrantPlayerResultEntity>> {
	let scores = new Map<string, EntrantPlayerResultEntity>();
	for (const pairing of pairings) {
		const { entrant1, entrant2 } = pairing;
		const playerScore = async (entrantPlayer: EntrantPlayerEntity) => {
			return await playerRepo.findEntrantWinsLosses(entrantPlayer, roundNumber - 1)
		}
		scores.set(entrant1.player.psUser, await playerScore(entrant1));
		scores.set(entrant2.player.psUser, await playerScore(entrant2));
	}
	return scores;
}