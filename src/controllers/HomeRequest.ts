/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import IRequest from "../interfaces/IRequest";
import RequestData from "../decorators/RequestData";
import RequestMethod from "../enums/RequestMethod";

@RequestData({
	pathname: '',
	method: RequestMethod.GET
})
export default class HomeRequest implements IRequest {

	handler(): Promise<void> {
		return Promise.resolve(undefined);
	}

}