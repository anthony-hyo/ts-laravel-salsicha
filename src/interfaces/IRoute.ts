/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import RequestMethod from "../app/enums/RequestMethod";

export default interface IRoute {
	path: string;
	method: RequestMethod;
	controller: any;
	handler: string;
	middlewares: Function[];
}