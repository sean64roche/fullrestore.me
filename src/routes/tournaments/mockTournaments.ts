
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Tournament {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
	status: TournamentStatus;
	teams: number;
	prizePool: number;
	format: string;
	location: string;
	game: string;
}

export const SAMPLE_TOURNAMENTS: Tournament[] = [
	{
		id: 1,
		name: "Old Money Open",
		startDate: "2024-09-01",
		endDate: "2024-10-31",
		status: "ongoing",
		teams: 16,
		prizePool: 1000000,
		format: "Best of 3, Single Elimination",
		location: "Stockholm, Sweden",
		game: "Gen 9 OU"
	},
	{
		id: 2,
		name: "ADV Revival",
		startDate: "2025-04-01",
		endDate: "2025-04-10",
		status: "upcoming",
		teams: 18,
		prizePool: 2000000,
		format: "Group Stage + Single Elimination",
		location: "Singapore",
		game: "Gen 3 OU"
	},
	{
		id: 3,
		name: "Jimvitational",
		startDate: "2024-12-15",
		endDate: "2024-12-20",
		status: "completed",
		teams: 24,
		prizePool: 1500000,
		format: "Group Stage + Double Elimination",
		location: "Seoul, South Korea",
		game: "Gen 3 OU"
	}
];

export const getStatusColor = (status: string) => {
	switch (status) {
		case 'upcoming':
			return 'bg-green-500 hover:bg-green-600';
		case 'completed':
			return 'bg-gray-500 hover:bg-gray-600';
		case 'ongoing':
			return 'bg-blue-500 hover:bg-blue-600';
		default:
			return 'bg-gray-500 hover:bg-gray-600';
	}
};
