/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

class Game {
	constructor(
		public url: string,
		public name: string,
		public description: string,
		public logo: string,
		public logoMini: string,
		public icon: string,
		public background: string,
		public themeColor: string
	) {
	}
}

export default class LauncherController {

	private readonly sidebar: HTMLElement | null;
	private readonly gameLogo: HTMLImageElement | null;
	private readonly gameBackgroundOverlay: HTMLElement | null;
	private readonly gameDescription: HTMLParagraphElement | null;
	private readonly btnPlayNow: HTMLAnchorElement | null;
	private readonly mainContent: HTMLElement | null;
	private readonly gameList: HTMLElement | null;
	private readonly sidebarToggleButton: HTMLButtonElement | null;

	private games: Game[] = [];

	constructor() {
		this.sidebar = document.querySelector<HTMLDivElement>('.sidebar');
		this.gameLogo = document.querySelector<HTMLImageElement>('.main-content img');
		this.gameBackgroundOverlay = document.querySelector<HTMLDivElement>('.overlay');
		this.gameDescription = document.querySelector<HTMLDivElement>('.main-content p');
		this.btnPlayNow = document.querySelector<HTMLAnchorElement>('#btn-play-now');
		this.mainContent = document.querySelector<HTMLDivElement>('.main-content');
		this.gameList = document.querySelector<HTMLDivElement>('.game-list');
		this.sidebarToggleButton = document.querySelector<HTMLButtonElement>('.sidebar button');

		this.sidebarToggleButton?.addEventListener('click', () => this.toggleMenu());

		this.fetchServers();
	}

	private async fetchServers(): Promise<void> {
		try {
			const response = await fetch('/api/servers');
			const data = await response.json();

			this.games = data.data.map((server: any) => new Game(
				server.url, server.name, server.description,
				server.logo, server.logoMini, server.icon,
				server.background, server.themeColor
			));

			this.renderSidebar();
			this.setGameState(this.games[0]);
		} catch (error) {
			console.error('Error fetching servers:', error);
		}
	}

	private renderSidebar(): void {
		if (!this.sidebar) return;
		const fragment = document.createDocumentFragment();

		this.games.forEach((game, index) => {
			const img = document.createElement('img');
			img.src = game.icon;
			img.alt = game.name;

			img.dataset.index = index.toString();

			img.setAttribute('data-tooltip', game.name);
			img.setAttribute('data-position', 'right');

			if (index === 0) {
				img.classList.add('selected');
				img.style.backgroundColor = game.themeColor;
				img.style.borderColor = game.themeColor;
			}

			img.addEventListener('click', (event) => this.handleGameSelection(event));
			fragment.appendChild(img);
		});

		this.sidebar.appendChild(fragment);
	}

	private handleGameSelection(event: Event): void {
		const target = event.target as HTMLImageElement;
		const index = Number(target.dataset.index);
		const game = this.games[index];

		const selectedImg = document.querySelector('.sidebar img.selected');
		selectedImg?.classList.remove('selected');

		target.classList.add('selected');
		target.style.backgroundColor = game.themeColor;
		target.style.borderColor = game.themeColor;

		this.setGameState(game);
	}

	private setGameState(game: Game): void {
		if (!this.gameLogo || !this.gameDescription || !this.gameBackgroundOverlay || !this.btnPlayNow) return;

		document.body.style.backgroundImage = `url(${game.background})`;
		this.gameLogo.src = game.logo;
		this.gameDescription.textContent = game.description;
		this.gameBackgroundOverlay.style.backgroundColor = this.makeTransparent(game.themeColor, 0.07);
		this.btnPlayNow.style.background = game.themeColor;
		this.btnPlayNow.href = game.url;
	}

	private makeTransparent(color: string, percentage: number): string {
		const match = color.match(/^#([0-9A-Fa-f]{6})$/);
		if (match) {
			const hex = match[1];
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			return `rgba(${r}, ${g}, ${b}, ${percentage})`;
		}
		return color;
	}

	private toggleMenu(): void {
		this.mainContent?.classList.toggle('hidden');
		this.gameList?.classList.toggle('hidden');

		if (this.gameList && !this.gameList.querySelector('.game-item')) {
			this.renderGameCards();
		}
	}

	private renderGameCards(): void {
		if (!this.gameList) return;

		const gameCards = document.createElement('div');
		gameCards.style.display = 'flex';
		gameCards.style.flexWrap = 'wrap';
		gameCards.style.justifyContent = 'center';

		this.games.forEach(game => {
			const card = document.createElement('div');
			card.classList.add('game-item');
			card.innerHTML = `
                <img src="${game.logoMini}" alt="${game.name}">
                <h3>${game.name}</h3>
                <button style="background:${game.themeColor}">Play Now</button>
            `;
			gameCards.appendChild(card);
		});

		this.gameList.appendChild(gameCards);
	}
}