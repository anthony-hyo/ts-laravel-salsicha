/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */


import LauncherController from "./LauncherController";

declare global {
	// noinspection ES6ConvertVarToLetConst
	var LauncherController: typeof import("./LauncherController").default;
}

global.LauncherController = LauncherController;