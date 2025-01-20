/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import "reflect-metadata";
import RequestMethod from "../enums/RequestMethod";

export function Route(path: string, method: RequestMethod = RequestMethod.GET) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		Router.register(path, method, target.constructor, propertyKey);
	};
}

export class Router {
	private static routes: { path: string; method: RequestMethod; controller: any; handler: string }[] = [];

	public static register(path: string, method: RequestMethod, controller: any, handler: string) {
		this.routes.push({path, method, controller, handler});
	}

	public static match(path: string, method: RequestMethod) {
		return this.routes.find(route => route.path === path && route.method === method);
	}
}
