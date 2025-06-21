// import { playerRepo } from '$api/config';
// import type { PairingPage } from '$lib/roundCategory';
// import type { PairingEntity } from '@fullrestore/service';
// import { fetchPairingsByUsername } from '$api/playerApi';
//
// export const load = async ({ params }) => {
//
// 	const player = await playerRepo.fetchPlayer(params.slug);
// 	const pairingsData = await fetchPairingsByUsername(player.psUser);
// 	const pairings: PairingPage[] = pairingsData.map((pairing: PairingEntity): PairingPage => ({
// 		id: pairing.id,
// 		player1: pairing.entrant1.player,
// 		player2: pairing.entrant2.player,
// 		winner: pairing.winner?.player,
// 		replays: pairing.replays,
// 	}));
// 	return {
// 		player,
// 		pairings,
// 		post: {
// 			title: `Player: ${player.username} - Full Restore`,
// 			content: `Player: ${player.username}`,
// 		}
// 	};
// }