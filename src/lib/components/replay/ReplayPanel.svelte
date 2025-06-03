<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { ReplayEntity } from '@fullrestore/service';
	import { RotateCw } from 'lucide-svelte';

	let { replay }: { replay: ReplayEntity } = $props();
	let isLoading = $state(true);
	let error: Error | string = $state('');
	let iframeContainer = $state<HTMLElement | null>(null);
	let currentIframe = $state<HTMLIFrameElement | null>(null);

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

		if (currentIframe) {
			currentIframe.remove();
			currentIframe = null;
		}

		iframeContainer.innerHTML = '';

		isLoading = true;
		error = '';

		try {
			const iframe = document.createElement('iframe');
			iframe.style.width = '100%';
			iframe.style.height = '768px';
			iframe.style.border = 'none';
			iframe.title = 'Pokemon Showdown Replay';
			iframe.sandbox = 'allow-scripts allow-same-origin';

			currentIframe = iframe;
			iframeContainer.appendChild(iframe);

			const data = replay.json;
			if (!data || !data.log) {
				throw new Error('Invalid replay data format');
			}

			// Wait for iframe to be ready

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
					`body { background-color: white; color: black; margin: 0; min-height: 640px; overflow: hidden; }` +
					`.wrapper { margin: 0 auto; max-width: 1180px; }` +
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
			};

		} catch (err: any) {
			console.error('Error setting up replay:', err);
			error = err.message || 'Failed to load replay';
			isLoading = false;
		}
	}

	function refreshReplay() {
		loadReplay();
	}

</script>

<div class="replay-container">
	<div class="content-area">
		{#if isLoading}
			<div class="skeleton flex gap-4"></div>
		{/if}
		{#if error}
			<div class="error">Error: {error}</div>
		{/if}
		<div bind:this={iframeContainer} class="iframe-wrapper" class:hidden={isLoading || error}></div>	</div>
	<div class="controls">
		{#if !isLoading}
			<button
				onclick={refreshReplay}
				disabled={isLoading}
				class="btn btn-style btn-md refresh-btn"
			>
				<RotateCw /> Reload Replay
			</button>
		{/if}
	</div>
</div>

<style>
    .replay-container {
        position: relative;
        width: 100%;
        contain: layout;
    }

    .content-area {
        position: relative;
        width: 100%;
        min-height: 800px;
				overflow: hidden;
    }

    .controls {
        position: absolute;
        left: 10px;
        top: 62%;
        transform: translateY(-50%);
        z-index: 20;
    }

    .refresh-btn {
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    @media (max-width: 820px) {
        .controls {
            position: relative;
            top: 20px;
        }
    }

    .refresh-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
    }

    .skeleton {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
				height: 460px;
        z-index: 5;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .error {
        color: #d32f2f;
        z-index: 15;
    }

    .error div:first-child {
        margin-bottom: 10px;
    }

    .iframe-wrapper {
        width: 100%;
        position: relative;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        transition: opacity 0.3s ease;
    }

    .iframe-wrapper.hidden {
        opacity: 0;
        pointer-events: none;
    }

</style>