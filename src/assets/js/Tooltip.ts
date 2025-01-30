/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

export default class Tooltip {
	private tooltip: HTMLElement;
	private timeoutId: number | null = null;

	constructor(private element: HTMLElement, private title: string, private placement: 'top' | 'bottom' | 'left' | 'right') {
		this.tooltip = document.createElement('div');
		this.tooltip.className = 'tooltip tooltip-' + placement;
		this.tooltip.innerHTML = `<div class="tooltip-arrow"></div>${title}`;
	}

	// Mostrar o Tooltip
	public show(): void {
		document.body.appendChild(this.tooltip);

		const rect = this.element.getBoundingClientRect();
		const tooltipRect = this.tooltip.getBoundingClientRect();

		let top: number = 0;
		let left: number = 0;

		if (this.placement === 'top') {
			top = rect.top - tooltipRect.height - 5;
			left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
		} else if (this.placement === 'bottom') {
			top = rect.bottom + 5;
			left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
		} else if (this.placement === 'left') {
			top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
			left = rect.left - tooltipRect.width - 5;
		} else if (this.placement === 'right') {
			top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
			left = rect.right + 5;
		}

		// Posicionando o tooltip
		this.tooltip.style.top = `${top}px`;
		this.tooltip.style.left = `${left}px`;

		// Exibir o tooltip com fade-in
		this.tooltip.style.opacity = '1';
	}

	// Esconder o Tooltip
	public hide(): void {
		// Fade-out ao esconder
		this.tooltip.style.opacity = '0';
		setTimeout(() => {
			this.tooltip.remove();
		}, 300); // Remover após o fade-out
	}
}