/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import "reflect-metadata";

export function Route(path: string, method: string = "GET") {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		Router.register(path, method, target.constructor, propertyKey);
	};
}

export class Router {
	private static routes: { path: string; method: string; controller: any; handler: string }[] = [];

	public static register(path: string, method: string, controller: any, handler: string) {
		this.routes.push({ path, method, controller, handler });
	}

	public static match(path: string, method: string) {
		return this.routes.find(route => route.path === path && route.method === method);
	}
}
