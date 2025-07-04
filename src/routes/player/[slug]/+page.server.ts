import { playerRepo } from '$api/config.server';
import { type Accolade, fetchAccolades, fetchRecentPlayerMatches, type PlayerQParams } from '$api/playerApi.server';
import type { PlayerPairing, PlayerPage } from '$api/pairingsApi.server';
import { transformPlayerResponse, transformTournamentResponse } from '@fullrestore/service';
import type { TournamentQParams } from '$api/tournamentsApi.server';

export const load = async ({ params }) => {

	const player = await playerRepo.fetchPlayer(params.slug);
	const pairingsData = await fetchRecentPlayerMatches(player.psUser);
	const pairings: PlayerPairing[] = pairingsData.map((pairing): PlayerPairing => ({
		round: pairing.Round.round,
		player1: transformPlayerResponse(pairing.Entrant1.Player) as PlayerQParams,
		player2: transformPlayerResponse(pairing.Entrant2.Player) as PlayerQParams,
		winner: pairing.Winner?.Player && transformPlayerResponse(pairing.Winner.Player) as PlayerQParams,
		tournament: transformTournamentResponse(pairing.Round.Tournament) as TournamentQParams,
	}));
	const accoladesData = await fetchAccolades(player.id);
	const accolades: Accolade[] = accoladesData.map((tournament) => ({
		tournamentName: tournament.name,
		position: 1,
	}));
	console.log(JSON.stringify(pairings, null, 2));
	return {
		player: {
			psUser: player.psUser,
			username: player.username,
			Aliases: player.Aliases,
		},
		pairings,
		accolades,
		post: {
			title: `Player: ${player.username} - Full Restore`,
			content: `Player: ${player.username}`,
		},
	} as PlayerPage;
}