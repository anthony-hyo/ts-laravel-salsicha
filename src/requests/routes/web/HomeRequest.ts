/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import RequestData from "../../../decorators/RequestData";
import RequestMethod from "../../../enums/RequestMethod";
import IRequest from "../../../interfaces/IRequest";

@RequestData({
	pathname: '/',
	method: RequestMethod.GET
})
export default class HomeRequest implements IRequest {

	public handler(): Response {
		return new Response(JSON.stringify({
			data: 0
		}), {
			headers: {
				"Content-Type": "application/json"
			}
		});
	}

}