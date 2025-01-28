/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import ServerController from "../app/controllers/ServerController";
import HomeController from "../app/controllers/HomeController";

//TODO: Automatic

export default function loadRoutes() {
	new HomeController();
	new ServerController();
}
