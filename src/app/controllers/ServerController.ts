/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import RequestMethod from "../enums/RequestMethod";
import Helper from "../helpers/Helper";
import {Route} from "../decorators/Route";
import {logger} from "../middlewares/logger";
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

export default class ServerController {

	private static readonly servers: IServer[] = [
		{
			url: "https://redhero.online/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://redaq.net/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://nullworld.net/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://augo.pw/",
			name: "Augoeides",
			description: "",
			logo: "https://augo.pw/assets/images/logo.png",
			logoMini: "https://augo.pw/assets/media/logos/favicon.ico",
			icon: "https://cdn.discordapp.com/attachments/786478018138603562/1331184236283170857/Untitled-1.png?ex=6790b16e&is=678f5fee&hm=94f25aebdd4624aef42a653a4380bc2284f7ffc1e9364203ff549a034fdb4bdf&",
			background: "",
			themeColor: "",
		},
		{
			url: "https://soulforge.cc/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://miracleaq.world/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://zexelworlds.com/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://adventura.quest/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://fruitaq.com/home?salsicha",
			name: "",
			description: "",
			logo: "",
			logoMini: "",
			icon: "",
			background: "",
			themeColor: "",
		},
		{
			url: "https://game.aq.com/game/",
			name: "",
			description: "",
			logo: "https://www.aq.com/img/network/logo-md-aqw.png",
			logoMini: "https://www.aq.com/img/network/logo-md-aqw.png",
			icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9AlLbLwi73G-Ce2KgRryBdvgTeMxCuoXyZg&s",
			background: "https://www.aq.com/img/bg/bg-lg-masterheader.jpg",
			themeColor: "",
		}
	];

	@Route("/", RequestMethod.GET, [logger])
	async index(request: Request): Promise<Response> {
		return await Renderer.view('launcher/home');
	}

	@Route("/api/servers", RequestMethod.GET, [logger])
	async getServers(request: Request): Promise<Response> {
		return Renderer.json({
			data: await Promise.all(
				ServerController.servers.map(async (server: IServer): Promise<IServer> => await ServerController.getServerData(server))
			)
		});
	}

	private static async getServerData(server: IServer): Promise<IServer> {
		const response: Response = await fetch(server.url);
		const html: string = await response.text();

		const metaTags: any[] = html.match(/<meta[^>]*>/g) || [];
		const bodyBgMatch: RegExpMatchArray | null = html.match(/body\s*{[^}]*background-image\s*:\s*url\(["']([^"']+)["']\)[^}]*}/);
		const logoMiniMatch: RegExpMatchArray | null = html.match(/<nav[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo mini["']/);
		const logoMatch: RegExpMatchArray | null = html.match(/<header[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo["']/);

		const background: string = bodyBgMatch ? bodyBgMatch[1] : "";
		const logoMini: string = logoMiniMatch ? logoMiniMatch[1] : "";
		const logo: string = logoMatch ? logoMatch[1] : "";

		const metaData: Record<string, string> = {
			background,
			logo,
			"logo-mini": logoMini
		};

		metaTags.forEach(tag => {
			const nameMatch = tag.match(/(name|property)=["']([^"']+)["']/);
			const contentMatch = tag.match(/content=["']([^"']+)["']/);
			if (nameMatch && contentMatch) {
				metaData[String(nameMatch[2])] = contentMatch[1];
			}
		});

		server.name = metaData["og:site_name"] || server.name;
		server.description = metaData["description"] || "";
		server.logo = Helper.validateUrl((metaData["logo"] || server.logo).replace(/\/default\/\d+/g, "/default/original"), server.url);
		server.logoMini = Helper.validateUrl((metaData["logo-mini"] || server.logoMini).replace(/\/default\/\d+/g, "/default/original"), server.url);
		server.icon = Helper.validateUrl(metaData["msapplication-TileImage"] || server.icon, server.url);
		server.background = Helper.validateUrl(metaData["background"] || server.background, server.url);
		server.themeColor = metaData["theme-color"] || server.themeColor;

		return server;
	}

}
