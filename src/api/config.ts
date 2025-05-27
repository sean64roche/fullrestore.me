import { createConfig } from "@fullrestore/service";
import type { ApiConfig } from "@fullrestore/service";
import { TournamentRepository, RoundRepository, PlayerRepository, PairingRepository } from "@fullrestore/service";
import axios from "axios";

import {
	API_BASEURL,
	API_FORMATS_ENDPOINT,
	API_PLAYERS_ENDPOINT,
	API_PLAYER_ALIASES_ENDPOINT,
	API_TOURNAMENTS_ENDPOINT,
	API_ROUNDS_ENDPOINT,
	API_ROUND_BYES_ENDPOINT,
	API_ENTRANT_PLAYERS_ENDPOINT,
	API_PAIRINGS_ENDPOINT,
	API_REPLAYS_ENDPOINT,
	API_KEY,
} from '$env/static/private';

// const date = new Date();
// log4js.configure({
// 	appenders: {
// 		console: { type: 'console' },
// 		app: { type: 'file', filename: `./logs/importer-${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.log`},
// 	},
// 	categories: {
// 		default: {
// 			appenders: ['console', 'app'],
// 			level: process.env.LOG4JS_LEVEL || 'ERR'
// 		}
// 	}
// });

axios.defaults.baseURL = API_BASEURL || 'http://localhost:3000';
axios.defaults.headers.common['x-api-key'] = `${API_KEY}`;

export const apiConfig: ApiConfig = createConfig({
	baseUrl: axios.defaults.baseURL,
	apiKey: API_KEY,
	formatsEndpoint: API_FORMATS_ENDPOINT,
	playersEndpoint: API_PLAYERS_ENDPOINT,
	playerAliasesEndpoint: API_PLAYER_ALIASES_ENDPOINT,
	tournamentsEndpoint: API_TOURNAMENTS_ENDPOINT,
	roundsEndpoint: API_ROUNDS_ENDPOINT,
	roundByesEndpoint: API_ROUND_BYES_ENDPOINT,
	entrantPlayersEndpoint: API_ENTRANT_PLAYERS_ENDPOINT,
	pairingsEndpoint: API_PAIRINGS_ENDPOINT,
	replaysEndpoint: API_REPLAYS_ENDPOINT,
	timeout: 10000,
});

export const tournamentRepo: TournamentRepository = new TournamentRepository(apiConfig);
export const roundRepo: RoundRepository = new RoundRepository(apiConfig);
export const playerRepo: PlayerRepository = new PlayerRepository(apiConfig);
export const pairingRepo: PairingRepository = new PairingRepository(apiConfig);