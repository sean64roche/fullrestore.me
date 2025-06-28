import { fetchRecentMatches, type PlayerQParams } from '$api/playerApi.server';
import type { PlayerPairing } from '$api/pairingsApi.server';
import type { TournamentQParams } from '$api/tournamentsApi.server';
import { transformPlayerResponse, transformTournamentResponse } from '@fullrestore/service';

export const load = async ()=> {

	const pairingsData = await fetchRecentMatches(1, 5);
	const pairings: PlayerPairing[] = pairingsData.map((pairing): PlayerPairing => ({
		round: pairing.Round.round,
		player1: transformPlayerResponse(pairing.Entrant1.Player) as PlayerQParams,
		player2: transformPlayerResponse(pairing.Entrant2.Player) as PlayerQParams,
		winner: pairing.Winner?.Player && transformPlayerResponse(pairing.Winner.Player) as PlayerQParams,
		tournament: transformTournamentResponse(pairing.Round.Tournament) as TournamentQParams,
	}));
	return {
		pairings,
		post: {
			title: `Home - Full Restore`,
			content: `Explore Pokémon Showdown matches through tournaments, formats, stats, players and teams`,
		},
	}
}