import { type PlayerQParams, searchPlayer } from '$api/playerApi.server';
import { transformPlayerResponse } from '@fullrestore/service';

export const load = async ({ params }) => {
	const searchResults = await searchPlayer(params.slug);
	const players: PlayerQParams[] = [];
	for (const player of searchResults) {
		players.push(transformPlayerResponse(player) as PlayerQParams);
	}
	return {
		players,
		slug: params.slug,
		post: {
			title: `Search: Player '${params.slug}' - Full Restore`,
			content: ``,
		},
	};
}