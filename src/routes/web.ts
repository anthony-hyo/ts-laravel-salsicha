/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import HomeController from "../app/controllers/HomeController";
import ServerController from "../app/controllers/ServerController";

export function loadRoutes() {
	new HomeController();
	new ServerController();
}
