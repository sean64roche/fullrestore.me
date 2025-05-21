interface Battle {
	id: string;
	$frame: JQuery;
	$logFrame: JQuery;
	log: string[];
	isReplay: boolean;
	paused: boolean;
	autoresize: boolean;
	started: boolean;
	messageShownTime: number;
	messageFadeTime: number;
	scene: { updateAcceleration: () => void };

	pause(): void;
	play(): void;
	reset(): void;
	seekBy(turns: number): void;
	seekTurn(turn: number): void;
	switchViewpoint(): void;
	setMute(muted: boolean): void;
	subscribe(callback: (state: string) => void): void;
}

interface Replays {
	battle: Battle | null;
	muted: boolean;
	$el: JQuery;

	init(): void;
	$(selector: string): JQuery;
	clickChangeSetting(e: JQuery.ClickEvent): void;
	changeSetting(type: string | JQuery, value: string, valueElem?: JQuery): void;
	update(state?: string): void;
	pause(): void;
	play(): void;
	reset(): void;
	ff(): void;
	rewind(): void;
	ffto(): void;
	switchViewpoint(): void;
}

interface Window {
	Replays: Replays;
	Battle: new (options: {
		id: string;
		$frame: JQuery;
		$logFrame: JQuery;
		log: string[];
		isReplay: boolean;
		paused: boolean;
		autoresize: boolean;
	}) => Battle;
	BattleSound: { muted: boolean };
	BattleLog: { escapeHTML: (text: string) => string };
	exports: Window;
}