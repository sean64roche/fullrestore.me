import { pairingRepo, roundRepo, tournamentRepo } from '$api/config.server';
import { loadRounds } from '$api/roundsApi.server';
import type { PairingPage } from '$lib/roundCategory';
import { calcEntrantPlayerScores } from '$api/pairingsApi.server';
import type { TournamentEntity, RoundEntity } from '@fullrestore/service';

class RoundCache {
	private cache = new Map<string, { data: any; expires: number }>();
	private ttl = 5 * 60 * 1000; // 5 minutes

	get(key: string) {
		const item = this.cache.get(key);
		if (!item || Date.now() > item.expires) {
			this.cache.delete(key);
			return null;
		}
		return item.data;
	}

	set(key: string, data: any) {
		this.cache.set(key, {
			data,
			expires: Date.now() + this.ttl
		});
	}

	invalidate(pattern: string) {
		for (const key of this.cache.keys()) {
			if (key.includes(pattern)) {
				this.cache.delete(key);
			}
		}
	}
}

const cache = new RoundCache();

export const load = async ({ params, setHeaders }): Promise<RoundsResult> => {
	const cacheKey = `tournament:${params.slug}:round:${params.rNumber}`;
	const cached = cache.get(cacheKey);
	if (cached) {
		setHeaders({
			'cache-control': 'public, max-age=300' // 5 minutes
		});
		return cached;
	}

	const tournament = await tournamentRepo.getBySlug(params.slug);
	const roundNumber = +params.rNumber.substring(1);
	const round = await roundRepo.get(tournament, roundNumber);
	const [pairingsData, allRounds] = await Promise.all([
		pairingRepo.getByRoundId(round.id),
		loadRounds(tournament)
	]);
	const entrantPlayerScores = await calcEntrantPlayerScores(pairingsData, roundNumber);
	const pairings: PairingPage[] = pairingsData.map((pairing): PairingPage => ({
		id: pairing.id,
		player1: pairing.entrant1.player,
		player2: pairing.entrant2.player,
		winner: pairing.winner?.player,
		replays: pairing.replays,
		p1score: entrantPlayerScores.get(pairing.entrant1.player.psUser)!.losses - entrantPlayerScores.get(pairing.entrant1.player.psUser)!.byes,
		p2score: entrantPlayerScores.get(pairing.entrant2.player.psUser)!.losses - entrantPlayerScores.get(pairing.entrant2.player.psUser)!.byes
	}));

	const result: RoundsResult = {
		pairings,
		tournament,
		round,
		allRounds,
		post: {
			title: `${tournament.name} Round ${roundNumber} - Full Restore`,
			content: `${tournament.name} Round ${roundNumber}`,
		}
	};

	cache.set(cacheKey, result);

	setHeaders({
		'cache-control': 'public, max-age=300'
	});

	return result;
}

type RoundsResult = {
	pairings: PairingPage[];
	tournament: TournamentEntity;
	round: RoundEntity;
	allRounds: RoundEntity[];
	post: {
		title: string;
		content: string;
	}
}