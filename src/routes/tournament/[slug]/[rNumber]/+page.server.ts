import { pairingRepo, roundRepo, tournamentRepo } from '../../../../api/config';

export const load = async ({ params }) => {
	const tournament = await tournamentRepo.getBySlug(params.slug);
	const roundNumber = +params.rNumber.charAt(params.rNumber.length - 1);
	const round = await roundRepo.get(tournament, roundNumber);
	const pairingsData = await pairingRepo.getByRoundId(round.id);
	const pairings = pairingsData.map((pairing) => ({
		id: pairing.id,
		player1: pairing.entrant1.player.psUser,
		player2: pairing.entrant2.player.psUser,
		winner: pairing.winner?.player.psUser,
		replays: pairing.replays,
	}));

	return {
		pairings,
		tournament,
		round,
	};
}