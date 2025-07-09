
import { json } from '@sveltejs/kit';
import { pairingRepo, roundRepo, tournamentRepo } from '$api/config.server';
import { loadRounds } from '$api/roundsApi.server';
import { calcEntrantPlayerScores } from '$api/pairingsApi.server';
import type { PairingPage } from '$lib/roundCategory';
import { _roundCache } from '../../tournament/[slug]/[rNumber]/+page.server';
import { env } from '$env/dynamic/private';

export async function POST({ request }: { request: Request; response: Response }): Promise<Response> {

	const apiKey = request.headers.get('x-api-key');
	if (!apiKey || apiKey !== env.API_KEY) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { tournamentSlug, roundNumber, action } = await request.json();

		if (!tournamentSlug || !roundNumber || !action) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const cacheKey = `tournament:${tournamentSlug}:round:r${roundNumber}`;

		if (action === 'invalidate') {
			_roundCache.invalidate(cacheKey);
			return json({ success: true, message: 'Cache invalidated' });

		} else if (action === 'warm') {
			await warmCacheForRound(tournamentSlug, roundNumber);
			return json({ success: true, message: 'Cache warmed' });

		} else {
			return json({ error: 'Invalid action' }, { status: 400 });
		}

	} catch (error) {
		console.error('Cache webhook error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

async function warmCacheForRound(tournamentSlug: string, roundNumber: number) {
	try {
		const tournament = await tournamentRepo.getBySlug(tournamentSlug);
		const round = await roundRepo.get(tournament, roundNumber);
		const pairingsData = await pairingRepo.getByRoundId(round.id);
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

		const allRounds = await loadRounds(tournament);

		const result = {
			pairings,
			tournament,
			round,
			allRounds,
			post: {
				title: `${tournament.name} Round ${roundNumber} - Full Restore`,
				content: `${tournament.name} Round ${roundNumber}`,
			}
		};

		const cacheKey = `tournament:${tournamentSlug}:round:r${roundNumber}`;
		_roundCache.set(cacheKey, result);

		console.log(`Cache warmed for ${tournamentSlug}/r${roundNumber}`);

	} catch (error) {
		console.error(`Failed to warm cache for ${tournamentSlug}/r${roundNumber}:`, error);
		throw error;
	}
}