/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import IRequestData from "../interfaces/IRequestData";
import Main from "../Main";
import IRequest from "../interfaces/IRequest";

export default function RequestData(data: IRequestData): ClassDecorator {
	return (target: Function): void => {
		Main.SINGLETON.requestRoute.addRoute({
			data: data,
			request: target as { new (...args: any[]): IRequest },
		})
	};
}