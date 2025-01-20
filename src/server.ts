/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {serve, Server} from "bun";
import * as console from "node:console";
import {loadRoutes} from "./routes/web";
import {Router} from "./decorators/Route";

class ServerApp {
	constructor() {
		this.startServer();
	}

	public startServer(): void {
		const server: Server = serve({
			async fetch(req: Request): Promise<Response> {
				const url = new URL(req.url);
				const matchedRoute = Router.match(url.pathname, req.method);

				if (matchedRoute) {
					const controllerInstance = new matchedRoute.controller();
					return controllerInstance[matchedRoute.handler](req);
				}

				return new Response("Route not found", { status: 404 });
			},
			port: 3000,
		});

		console.log(`Server running on ${server.url}`);
	}
}

// Carrega as rotas
loadRoutes();

new ServerApp();
