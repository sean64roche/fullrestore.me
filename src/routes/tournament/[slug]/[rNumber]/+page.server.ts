import type { EntrantPlayerEntity, EntrantPlayerResultEntity } from '@fullrestore/service';
import { pairingRepo, playerRepo, roundRepo, tournamentRepo } from '../../../../api/config';
import { loadRounds } from '../../../../api/roundsApi';
import type { PairingPage } from '$lib/roundCategory';

export const load = async ({ params }) => {
	const tournament = await tournamentRepo.getBySlug(params.slug);
	const roundNumber = +params.rNumber.substring(1);
	const round = await roundRepo.get(tournament, roundNumber);
	const pairingsData = await pairingRepo.getByRoundId(round.id);
	let entrantPlayerScores = new Map<string, EntrantPlayerResultEntity>();
	for (const pairing of pairingsData) {
		const { entrant1, entrant2 } = pairing;
		const playerScore = async (entrantPlayer: EntrantPlayerEntity) => {
			return await playerRepo.findEntrantWinsLosses(entrantPlayer, roundNumber - 1)
		}
		entrantPlayerScores.set(entrant1.player.psUser, await playerScore(entrant1));
		entrantPlayerScores.set(entrant2.player.psUser, await playerScore(entrant2));
	}
	const pairings: PairingPage[] = pairingsData.map((pairing): PairingPage => ({
		id: pairing.id,
		player1: pairing.entrant1.player,
		player2: pairing.entrant2.player,
		winner: pairing.winner?.player,
		replays: pairing.replays,
		p1score: entrantPlayerScores.get(pairing.entrant1.player.psUser)!.losses,
		p2score: entrantPlayerScores.get(pairing.entrant2.player.psUser)!.losses,
	}));
	const allRounds = await loadRounds(tournament);

	return {
		pairings,
		tournament,
		round,
		allRounds,
		post: {
			title: `${tournament.name} Round ${roundNumber} - Full Restore`,
			content: `${tournament.name} Round ${roundNumber}`,
		}
	};
}