import { compareAsc } from 'date-fns';

export function getTournamentStatus(startDate: string, endDate?: string): {
	style: string,
	status: string,
} {
	switch (compareAsc(startDate, Date.now())) {
		case 1:
		case 0:
			if (endDate && compareAsc(endDate, Date.now()) === 1) {
				return {
					style: 'bg-neutral text-neutral-content',
					status: 'completed'
				};
			} else {
				return {
					style: 'bg-secondary text-secondary-content',
					status: 'ongoing'
				};
			}
		case -1:
			return {
				style: 'bg-secondary text-secondary-content',
				status: 'upcoming'
			};
		default:
			return {
				style: 'bg-secondary text-secondary-content',
				status: 'unknown'
			};
	}
}