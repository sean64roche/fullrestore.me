import { createConfig } from "@fullrestore/service";
import type { ApiConfig } from "@fullrestore/service";
import { TournamentRepository, RoundRepository, PlayerRepository, PairingRepository } from "@fullrestore/service";
import axios from "axios";
import log4js from "log4js";

import { env } from '$env/dynamic/private';

axios.defaults.baseURL = env.API_BASEURL || 'http://localhost:3000';
axios.defaults.headers.common['x-api-key'] = `${env.API_KEY}`;

export const logger = log4js.getLogger("client");

export const apiConfig: ApiConfig = createConfig({
	baseUrl: axios.defaults.baseURL,
	apiKey: env.API_KEY,
	formatsEndpoint: env.API_FORMATS_ENDPOINT,
	playersEndpoint: env.API_PLAYERS_ENDPOINT,
	playerAliasesEndpoint: env.API_PLAYER_ALIASES_ENDPOINT,
	tournamentsEndpoint: env.API_TOURNAMENTS_ENDPOINT,
	roundsEndpoint: env.API_ROUNDS_ENDPOINT,
	roundByesEndpoint: env.API_ROUND_BYES_ENDPOINT,
	entrantPlayersEndpoint: env.API_ENTRANT_PLAYERS_ENDPOINT,
	pairingsEndpoint: env.API_PAIRINGS_ENDPOINT,
	replaysEndpoint: env.API_REPLAYS_ENDPOINT,
	timeout: 10000,
	logger: logger,
});

export const tournamentRepo: TournamentRepository = new TournamentRepository(apiConfig);
export const roundRepo: RoundRepository = new RoundRepository(apiConfig);
export const playerRepo: PlayerRepository = new PlayerRepository(apiConfig);
export const pairingRepo: PairingRepository = new PairingRepository(apiConfig);