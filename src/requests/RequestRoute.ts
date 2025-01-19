/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import IRequestRoute from "../interfaces/IRequestRoute";

export default class RequestRoute {

	private routes: Array<IRequestRoute> = [];

	public addRoute(requestRoute: IRequestRoute): void {
		this.routes.push(requestRoute);
	}

	public getRoute(pathname: string, method: string): IRequestRoute | undefined {
		return this.routes.find((requestRoute: IRequestRoute) => requestRoute.data.pathname === pathname && requestRoute.data.method === method);
	}

}
