import type { PlayerEntity, ReplayEntity } from '@fullrestore/service';

abstract class EliminationCategory {
	declare elim: number;
	declare groups: string[];
}
// lol
export function getEliminationType(elim: number, round: number): EliminationCategory {
	switch (elim) {
		case 2:
			if (round !== 1) {
				return {
					elim: 2,
					groups: [
						`Top (Winner's)`,
						`Bottom (Loser's)`
					]
				};
			} else {
				return {
					elim: 2,
					groups: []
				};
			}
		case 1:
			return {
				elim: 1,
				groups: []
			};
		case -1: // a forced edge case for rounds with a single pairing, e.g. finals
			return {
				elim: elim,
				groups: []
			}
		case 0:
		default:
			let groupValues: string[] = [];
			let wins = round - 1;
			for (let losses: number = 0; losses <= elim; losses++) {
				groupValues.push(`${wins} - ${losses}`);
				wins--;
			}
			return {
				elim: elim,
				groups: groupValues
			};

	}
}

export type PairingPage = {
	id: string;
	player1: PlayerEntity;
	player2: PlayerEntity;
	winner?: PlayerEntity;
	replays?: ReplayEntity[];
	p1score: number;
	p2score: number;
}