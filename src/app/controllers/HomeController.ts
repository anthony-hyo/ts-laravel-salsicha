/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {Route} from "../../decorators/Route";

export default class HomeController {
	@Route("/", "GET")
	async index(req: Request): Promise<Response> {
		return new Response(
			JSON.stringify({message: "Welcome to the Laravel-like Bun framework!"}),
			{headers: {"Content-Type": "application/json"}}
		);
	}

	@Route("/about", "GET")
	async about(req: Request): Promise<Response> {
		return new Response(
			JSON.stringify({message: "This is the About page!"}),
			{headers: {"Content-Type": "application/json"}}
		);
	}
}
