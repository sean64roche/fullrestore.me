import type { PlayerEntity } from '@fullrestore/service';

export type PlayerQParams = Omit<PlayerEntity, 'discordUser' | 'discordId'>;