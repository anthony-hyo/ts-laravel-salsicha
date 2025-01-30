/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import LauncherController from "./LauncherController";

document.addEventListener('DOMContentLoaded', function() {
	switch (window.location.pathname) {
		case '/launcher/home':
			new LauncherController();
			break
	}
});
