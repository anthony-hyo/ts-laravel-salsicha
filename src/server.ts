/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {serve, Server} from "bun";
import * as console from "node:console";
import {Router} from "./app/decorators/Route";
import RequestMethod from "./app/enums/RequestMethod";
import loadRoutes from "./routes/web";

class ServerApp {

	constructor() {
		this.startServer();
	}

	public startServer(): void {
		const server: Server = serve({
			async fetch(req: Request): Promise<Response> {
				try {
					const _url = new URL(req.url);
					const matchedRoute = Router.match(_url.pathname, <RequestMethod>req.method);

					if (matchedRoute) {
						const controllerInstance = new matchedRoute.controller();
						return await controllerInstance[matchedRoute.handler](req);
					}

					return new Response("Route not found", {status: 404});
				} catch (error) {
					console.error("Error occurred:", error);
					return new Response(
						JSON.stringify({
							message: "Internal Server Error",
							details: error,
						}),
						{
							status: 500,
							headers: {
								"Content-Type": "application/json"
							}
						}
					);
				}
			},
			port: 3000,
		});


		console.log(`Server running on ${server.url}`);
	}
}

loadRoutes();

new ServerApp();
