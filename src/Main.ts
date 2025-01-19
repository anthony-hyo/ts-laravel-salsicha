/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {serve, Server} from "bun";
import RequestRoute from "./requests/RequestRoute";
import * as console from "node:console";
import IRequestRoute from "./interfaces/IRequestRoute";
import IRequest from "./interfaces/IRequest";

export default class Main {

	private static _SINGLETON: Main;
	
	public readonly requestRoute: RequestRoute;

	constructor() {
		Main._SINGLETON = this;

		this.requestRoute = new RequestRoute();

		this.startServer();
	}

	public static get SINGLETON(): Main {
		return this._SINGLETON;
	}

	public startServer(): void {
		const server: Server = serve({
			async fetch(req: Request): Promise<Response> {
				const _url: URL = new URL(req.url);
				const matchedRoute: IRequestRoute | undefined = Main.SINGLETON.requestRoute.getRoute(_url.pathname, req.method);

				if (matchedRoute) {
					const handlerInstance: IRequest = new matchedRoute.request();
					return handlerInstance.handler();
				}

				return new Response("Route not found", { status: 404 });
			},
			port: 3000,
		});

		console.log(`Server running on ${server.url}`);
	}
}

new Main();
