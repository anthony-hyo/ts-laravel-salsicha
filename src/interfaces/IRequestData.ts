/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import RequestMethod from "../enums/RequestMethod";

export default interface IRequestData {

	method: RequestMethod;
	pathname: string;

}