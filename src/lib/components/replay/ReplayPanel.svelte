<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { ReplayEntity } from '@fullrestore/service';

	let { replay }: { replay: ReplayEntity } = $props();
	let isLoading = $state(true);
	let error: Error | string = $state('');
	let iframeContainer = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!browser) return;
			setTimeout(loadReplay, 0);
	});

	async function loadReplay() {
		if (!iframeContainer) {
			error = 'Container element not found';
			isLoading = false;
			console.error('Container element not found when trying to load replay');
			return;
		}

		try {
			const iframe = document.createElement('iframe');
			iframe.style.width = '100%';
			iframe.style.height = '600px';
			iframe.style.border = 'none';
			iframe.title = 'Pokemon Showdown Replay';

			iframeContainer.appendChild(iframe);

			const response = await fetch(`${replay.url}.json`);
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}

			const data = await response.json();
			if (!data || !data.log) {
				throw new Error('Invalid replay data format');
			}

			const iframeDoc = iframe.contentDocument;
			if (!iframeDoc) {
				throw new Error('Cannot access iframe document - check for cross-origin restrictions');
			}

			iframeDoc.open();
			iframeDoc.write(
					`<!DOCTYPE html>` +
					`<html lang="en">` +
						`<head>` +
						`<meta charset="utf-8">` +
						`<title>Pokemon Showdown Replay</title>` +
						`<meta name="viewport" content="width=device-width, initial-scale=1">` +
						`<base href="https://play.pokemonshowdown.com/">` +
						`<style>` +
						`body { background-color: white; color: black; margin: 0 }` +
						`.wrapper { margin: 0 auto; max-width: 1180px; height: 720px; }` +
						`.battle-log {
							position: relative;
							text-align: left;
							border: 1px solid #AAAAAA;
							background: #EEF2F5;
							color: black;
							top: 9px;

							font-family: Verdana, sans-serif;
							font-size: 10pt;

							overflow: auto;
							overflow-y: scroll;
							-webkit-overflow-scrolling: touch;
							word-wrap: break-word;
						}` +
						`</style>` +
						`</head>` +
						`<body>` +
							`<div class="wrapper replay-wrapper">` +
								`<div class="battle"></div>` +
								`<div class="battle-log"></div>` +
								`<div class="replay-controls"></div>` +
								`<div class="replay-controls-2"></div>` +
							`</div>` +
							`<script type="text/plain" class="battle-log-data">${data.log}</` + `script>` +
							`<script src="https://replay-embed.pages.dev/replay-embed.js"></` + `script>` +
					`</body>` +
					`</html>`
			);
			iframeDoc.close();

			iframe.onload = () => {
				isLoading = false;

				const adjustIframeHeight = () => {
					try {
						if (iframe.contentDocument && iframe.contentDocument.body) {
							const height = iframe.contentDocument.body.scrollHeight;
							iframe.style.height = `${height + 20}px`;
						}
					} catch (e) {
						console.warn('Could not adjust iframe height:', e);
					}
				};

				adjustIframeHeight();

				const intervalId = setInterval(adjustIframeHeight, 1000);

				return () => clearInterval(intervalId);
			};

		} catch (err: any) {
			console.error('Error setting up replay:', err);
			error = err.message || 'Failed to load replay';
			isLoading = false;
		}
	}
</script>

<div class="replay-container">
	<div bind:this={iframeContainer} class="iframe-wrapper"></div>
	{#if isLoading}
		<div class="loading centered"></div>
	{:else if error}
		<div class="error">Error: {error}</div>
	{/if}
</div>

<style>
    .replay-container {
        position: relative;
        width: 100%;
    }

    .loading, .error {
        padding: 1rem;
        text-align: center;
    }

    .loading {
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error {
        color: #d32f2f;
    }

    .iframe-wrapper {
        width: 100%;
    }
</style>