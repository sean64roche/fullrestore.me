<script lang="ts">
	import '../app.css';
	import '../app.postcss';
	import Navbar from '$components/Navbar.svelte';
	let { children } = $props();

</script>

<Navbar />

{@render children()}
