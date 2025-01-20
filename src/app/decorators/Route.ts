/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import "reflect-metadata";
import RequestMethod from "../enums/RequestMethod";
import IRoute from "../../interfaces/IRoute";

export function Route(path: string, method: RequestMethod = RequestMethod.GET, middlewares: Function[] = []) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		Router.register(path, method, target.constructor, propertyKey, middlewares);
	};
}

export class Router {

	private static routes: IRoute[] = [];

	public static register(path: string, method: RequestMethod, controller: any, handler: string, middlewares: Function[]) {
		this.routes.push({
			path,
			method,
			controller,
			handler,
			middlewares
		});
	}

	public static match(path: string, method: RequestMethod) {
		return this.routes.find(route => route.path === path && route.method === method);
	}

	public static async executeMiddlewares(middlewares: Function[], request: Request, response: Response, next: Function) {
		let index = 0;

		const runMiddleware = () => {
			if (index < middlewares.length) {
				middlewares[index](request, response, () => {
					index++;
					runMiddleware();
				});
			} else {
				next();
			}
		};

		runMiddleware();
	}

}
