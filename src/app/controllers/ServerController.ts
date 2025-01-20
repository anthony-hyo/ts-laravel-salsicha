/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {Route} from "../../decorators/Route";
import IServer from "../../interfaces/IServer";
import Helper from "../../helpers/Helper";
import RequestMethod from "../../enums/RequestMethod";
import {render} from "../views";

export default class ServerController {

	@Route("/", RequestMethod.GET)
	async index(req: Request): Promise<Response> {
		const pageTitle = "Home Page";
		const pageDescription = "Welcome to the homepage of this Bun-based framework.";

		const htmlContent = await render("index.ejs", { pageTitle, pageDescription });

		return new Response(htmlContent, {
			headers: { "Content-Type": "text/html" },
		});
	}

	@Route("/api/servers", RequestMethod.GET)
	async getServers(req: Request): Promise<Response> {
		const sortedServers: IServer[] = await Promise.all(
			this.servers.map(async (server) => await this.getServerData(server))
		);

		return new Response(JSON.stringify({data: sortedServers}), {
			headers: {"Content-Type": "application/json"},
		});
	}


	private validateUrl(inputUrl: string, baseUrl: string = "https://redhero.online"): string {
		return /^https?:\/\//.test(inputUrl) ? inputUrl : new URL(inputUrl, baseUrl).toString();
	}

	private servers: IServer[] = [
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
			icon: "https://augo.pw/assets/media/logos/favicon.ico",
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
			url: "https://game.aq.com/game/",
			name: "",
			description: "",
			logo: "https://www.aq.com/img/network/logo-md-aqw.png",
			logoMini: "https://www.aq.com/img/network/logo-md-aqw.png",
			icon: "https://www.artix.com/images/Games/AQWorlds-Promo-760.jpg",
			background: "https://www.aq.com/img/bg/bg-lg-masterheader.jpg",
			themeColor: "",
		}
	];

	private async getServerData(server: IServer): Promise<IServer> {
		const response: Response = await fetch(server.url);
		const html: string = await response.text();

		const metaTags: any[] = html.match(/<meta[^>]*>/g) || [];
		const bodyBgMatch: RegExpMatchArray | null = html.match(/body\s*{[^}]*background-image\s*:\s*url\(["']([^"']+)["']\)[^}]*}/);
		const logoMiniMatch: RegExpMatchArray | null = html.match(/<nav[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo mini["']/);
		const logoMatch: RegExpMatchArray | null = html.match(/<header[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo["']/);

		const background: string = bodyBgMatch ? bodyBgMatch[1] : "";
		const logoMini: string = logoMiniMatch ? logoMiniMatch[1] : "";
		const logo: string = logoMatch ? logoMatch[1] : "";

		const metaData: Record<string, string> = {background, logo, "logo-mini": logoMini};

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
