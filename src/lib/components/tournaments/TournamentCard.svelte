<script lang="ts">
	import { getStatusColor, type Tournament } from '../../../routes/tournaments/mockTournaments';
	import { Calendar } from 'lucide-svelte';
	let { tournament } = $props<{ tournament: Tournament }>();
</script>

<div class="card card-side bg-base-100 shadow-sm hover:shadow-lg transition-shadow h-48">
	<figure class="w-48 h-full min-w-48 overflow-hidden">
		<img
			src="revival2.webp"
			alt="Revival 2 Logo"
			class="object-cover w-full h-full"
		/>
	</figure>
	<div class="card-body flex flex-col justify-between">
		<div class="flex justify-between items-start ">
			<div>
				<h2 class="card-title">{tournament.name}</h2>
				<div class="flex items-center gap-2 text-sm text-gray-500">
					<Calendar class="w-4 h-4" />
					{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
					<div class="badge badge-ghost bg-purple-500 hover:bg-purple-600">{tournament.game}</div>
					<div class="badge badge-ghost {getStatusColor(tournament.status)}">
						{tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
					</div>
					<div class="card-actions justify-end absolute top-8 right-8">
						<button class="btn btn-primary">Explore</button>
					</div>
				</div>
			</div>
		</div>
		<div class="line-clamp-3">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
</div>