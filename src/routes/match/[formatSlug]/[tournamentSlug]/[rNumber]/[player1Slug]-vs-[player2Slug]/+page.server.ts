import { pairingRepo, playerRepo, roundRepo, tournamentRepo } from '../../../../../../api/config';
import { primaryUsername } from '../../../../../../api/playerApi';

export const load = async ({ params }) => {
	const tournament = await tournamentRepo.getBySlug(params.tournamentSlug);
	const roundNumber = +params.rNumber.charAt(params.rNumber.length - 1);
	const round = await roundRepo.get(tournament, roundNumber);
	const player1 = await playerRepo.fetchPlayer(params.player1Slug);
	const pairing = await pairingRepo.fetchPairing(round.id, player1.psUser);
	const player2 = pairing.entrant2.player;
	return {
		pairing,
		tournament,
		round,
		player1,
		player2,
		post: {
			title: `${primaryUsername(player1)} vs. ${primaryUsername(player2)} - Full Restore`,
			content: `Tournament set ${primaryUsername(player1)} vs. ${primaryUsername(player2)} in ${tournament.name} Round ${round.roundNumber}`,
		}
	};
}