import { pairingRepo } from '../../../api/config';

export const load = async ({ params }) => {
	const pairing = await pairingRepo.get(params.slug);
	const round = pairing.round;
	const tournament = round.tournament;
	const player1 = pairing.entrant1.player;
	const player2 = pairing.entrant2.player;
	return {
		pairing,
		tournament,
		round,
		player1,
		player2,
	};
}