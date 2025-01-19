/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import IRequestData from "./IRequestData";
import IRequest from "./IRequest";

export default interface IRequestRoute {

	data: IRequestData;
	request: { new(...args: any[]): IRequest };

}