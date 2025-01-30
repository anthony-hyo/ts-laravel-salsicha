/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import RequestMethod from "../enums/RequestMethod";
import {Route} from "../decorators/Route";
import Renderer from "../helpers/Renderer";

interface IServer {
	url: string;
	name: string;
	description: string;
	logo: string;
	logoMini: string;
	icon: string;
	background: string;
	themeColor: string;
}

export default class HomeController {

	@Route("/", RequestMethod.GET)
	async index(request: Request): Promise<Response> {
		return await Renderer.view('home');
	}

}
