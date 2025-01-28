/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import RequestMethod from "../enums/RequestMethod";
import Helper from "../helpers/Helper";
import {Route} from "../decorators/Route";
import {logger} from "../middlewares/logger";
import Renderer from "../helpers/Renderer";
import Database from "../prisma/PrismaClient";
import {PrismaClient} from "@prisma/client";

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

	@Route("launcher/home", RequestMethod.GET, [logger])
	async index(request: Request): Promise<Response> {
		return await Renderer.view('launcher/home');
	}

	@Route("/api/servers", RequestMethod.GET, [logger])
	async getServers(request: Request): Promise<Response> {
		const prisma: PrismaClient = Database.prisma;

		const servers: IServer[] = await prisma.server.findMany();

		return Renderer.json({
			data: servers.map((data: IServer): IServer => ({
				url: data.url,
				name: data.name,
				description: data.description,
				logo: data.logo,
				logoMini: data.logoMini,
				icon: data.icon,
				background: data.background,
				themeColor: data.themeColor,
			})),
		});
	}

	@Route("/api/servers/update", RequestMethod.GET, [logger])
	async updateServers(request: Request): Promise<Response> {
		const prisma: PrismaClient = Database.prisma;

		const servers: IServer[] = await prisma.server.findMany();

		await Promise.all(
			servers.map(async (server: IServer): Promise<IServer> => {
				const updatedServer: IServer = await ServerController.getServerData(server);

				return prisma.server.upsert({
					where: {
						url: updatedServer.url
					},
					update: updatedServer,
					create: updatedServer,
				});
			})
		);

		return Renderer.text("ok");
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
