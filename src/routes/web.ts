/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import HomeController from "../app/controllers/HomeController";

export function loadRoutes() {
	new HomeController(); // As rotas são automaticamente registradas ao instanciar o controlador
}
