import { compareAsc } from 'date-fns';

export function getTournamentStatus(startDate: string, endDate?: string): {
	style: string,
	status: string,
} {
	switch (compareAsc(startDate, Date.now())) {
		case 1:
			return {
				style: 'bg-info text-info-content',
				status: 'upcoming'
			};
		case 0:
		case -1:
			if (endDate && compareAsc(endDate, Date.now()) === -1) {
				return {
					style: 'bg-secondary text-secondary-content',
					status: 'completed'
				};
			} else {
				return {
					style: 'bg-success text-success-content',
					status: 'ongoing'
				};
			}
		default:
			return {
				style: 'bg-neutral text-neutral-content',
				status: 'unknown'
			};
	}
}