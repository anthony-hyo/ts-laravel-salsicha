/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import LauncherController from "./LauncherController";

declare global {
	var LauncherController: typeof import("./LauncherController").default;
}

global.LauncherController = LauncherController;


console.log(2)