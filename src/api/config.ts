import { createConfig } from "@fullrestore/fullrestore-service";
import type { ApiConfig } from "@fullrestore/fullrestore-service";
import { TournamentRepository, RoundRepository } from "@fullrestore/fullrestore-service";
import axios from "axios";
import log4js from 'log4js';
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
	API_TOKEN,
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
axios.defaults.headers.common['Authorization'] = `Bearer ${API_TOKEN}`;

export const apiConfig: ApiConfig = createConfig({
	baseUrl: axios.defaults.baseURL,
	token: API_TOKEN,
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
	logger: log4js.getLogger(),
});

export const tournamentRepo: TournamentRepository = new TournamentRepository(apiConfig);
export const roundRepo: RoundRepository = new RoundRepository(apiConfig);
