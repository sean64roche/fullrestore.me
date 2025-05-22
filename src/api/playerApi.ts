import type { PlayerEntity } from '@fullrestore/service';

export type PlayerQParams = Omit<PlayerEntity, 'discordUser' | 'discordId'>;

export function primaryUsername(player: PlayerEntity) {
	return player.Aliases.find(alias => alias.primary)?.alias || player.psUser;
}