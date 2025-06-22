import { playerRepo } from '$api/config.server';
import { fetchPairingsByUsername, type PlayerQParams } from '$api/playerApi.server';
import type { PlayerPairing, PlayerPairingPage } from '$api/pairingsApi.server';
import { transformPlayerResponse, transformTournamentResponse } from '@fullrestore/service';
import type { TournamentQParams } from '$api/tournamentsApi.server';

export const load = async ({ params }) => {

	const player = await playerRepo.fetchPlayer(params.slug);
	const pairingsData = await fetchPairingsByUsername(player.psUser);
	const pairings: PlayerPairing[] = pairingsData.map((pairing): PlayerPairing => ({
		round: pairing.Round.round,
		player1: transformPlayerResponse(pairing.Entrant1.Player) as PlayerQParams,
		player2: transformPlayerResponse(pairing.Entrant2.Player) as PlayerQParams,
		winner: pairing.Winner?.Player && transformPlayerResponse(pairing.Winner.Player) as PlayerQParams,
		tournament: transformTournamentResponse(pairing.Round.Tournament) as TournamentQParams,
	}));
	return {
		player: {
			psUser: player.psUser,
			username: player.username,
			Aliases: player.Aliases,
		},
		pairings,
		post: {
			title: `Player: ${player.username} - Full Restore`,
			content: `Player: ${player.username}`,
		},
	} as PlayerPairingPage;
}