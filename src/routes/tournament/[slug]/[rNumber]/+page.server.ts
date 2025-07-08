import { pairingRepo, roundRepo, tournamentRepo } from '$api/config.server';
import { loadRounds } from '$api/roundsApi.server';
import type { PairingPage } from '$lib/roundCategory';
import { calcEntrantPlayerScores } from '$api/pairingsApi.server';

export const load = async ({ params }) => {
	const tournament = await tournamentRepo.getBySlug(params.slug);
	const roundNumber = +params.rNumber.substring(1);
	const round = await roundRepo.get(tournament, roundNumber);
	const pairingsData = await pairingRepo.getByRoundId(round.id);
	const entrantPlayerScores = await calcEntrantPlayerScores(pairingsData, roundNumber);
	const pairings: PairingPage[] = pairingsData.map((pairing): PairingPage => ({
		id: pairing.id,
		player1: pairing.entrant1.player,
		player2: pairing.entrant2.player,
		winner: pairing.winner?.player,
		replays: pairing.replays,
		p1score: entrantPlayerScores.get(pairing.entrant1.player.psUser)!.losses - entrantPlayerScores.get(pairing.entrant1.player.psUser)!.byes,
		p2score: entrantPlayerScores.get(pairing.entrant2.player.psUser)!.losses - entrantPlayerScores.get(pairing.entrant2.player.psUser)!.byes
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