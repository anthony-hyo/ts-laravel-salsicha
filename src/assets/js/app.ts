/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import LauncherController from "./LauncherController";
import Tooltip from "./Tooltip";

document.addEventListener('DOMContentLoaded', () => {
	const existingNodes = document.querySelectorAll('[data-tooltip]');
	existingNodes.forEach((node) => {
		node.addEventListener('mouseenter', (e) => {
			const target = e.target as HTMLElement;
			const title = target.getAttribute('data-tooltip')!;
			const placement = target.getAttribute('data-placement') as 'top' | 'bottom' | 'left' | 'right';
			const tooltip = new Tooltip(target, title, placement);
			tooltip.show();

			(target as any)._tooltip = tooltip;
		});

		node.addEventListener('mouseleave', (e) => {
			const target = e.target as HTMLElement;
			if ((target as any)._tooltip) {
				(target as any)._tooltip.hide();
				delete (target as any)._tooltip;
			}
		});
	});


	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				const addedNodes = mutation.addedNodes;
				addedNodes.forEach((node) => {
					if (node instanceof HTMLElement && node.hasAttribute('data-tooltip')) {
						node.addEventListener('mouseenter', (e) => {
							const target = e.target as HTMLElement;
							const title = target.getAttribute('data-tooltip')!;
							const placement = target.getAttribute('data-placement') as 'top' | 'bottom' | 'left' | 'right';
							const tooltip = new Tooltip(target, title, placement);
							tooltip.show();

							(target as any)._tooltip = tooltip;
						});

						node.addEventListener('mouseleave', (e) => {
							const target = e.target as HTMLElement;
							if ((target as any)._tooltip) {
								(target as any)._tooltip.hide();
								delete (target as any)._tooltip;
							}
						});
					}
				});
			}
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	switch (window.location.pathname) {
		case '/launcher/home':
			new LauncherController();
			break;
	}
});
