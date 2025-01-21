/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {serve, Server} from "bun";
import * as console from "node:console";
import {Router} from "./app/decorators/Route";
import RequestMethod from "./app/enums/RequestMethod";
import loadRoutes from "./routes/web";
import IRoute from "./interfaces/IRoute";
import Renderer from "./app/helpers/Renderer";
import path from "path";

export default class ServerApp {

	public static readonly rootPath: string = __dirname;
	public static readonly viewsPath: string = path.resolve(ServerApp.rootPath, "views");

	constructor() {
		this.startServer();
	}

	public startServer(): void {
		const server: Server = serve({
			async fetch(req: Request): Promise<Response> {
				try {
					const _url: URL = new URL(req.url);
					const matchedRoute: IRoute | undefined = Router.match(_url.pathname, <RequestMethod>req.method);

					if (matchedRoute) {
						const controllerInstance: any = new matchedRoute.controller();

						return await new Promise<Response>(async (resolve: (value: (PromiseLike<Response> | Response)) => void, reject: (reason?: any) => void): Promise<void> => {
							try {
								await Router.executeMiddlewares(matchedRoute.middlewares, req, new Response(), async (): Promise<void> => {
									const result: any = await controllerInstance[matchedRoute.handler](req);
									resolve(result);
								});
							} catch (error) {
								reject(Renderer.serverError());
							}
						});
					}

					return Renderer.notFound();
				} catch (error) {
					console.error("Error occurred:", error);
					return Renderer.serverError();
				}
			},
			port: 3000,
		});


		console.log(`Server running on ${server.url}`);
	}
}

loadRoutes();

new ServerApp();
