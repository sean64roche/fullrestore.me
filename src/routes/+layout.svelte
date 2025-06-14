<script lang="ts">
	import '../app.css';
	import '../app.postcss';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	let { children } = $props();
</script>

<Navbar />
<main class="flex-grow">
	{@render children()}
</main>
<Footer />
