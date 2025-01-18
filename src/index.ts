import {serve} from "bun";
import path from "path";

async function getMetaData(url: string): Promise<Record<string, string>> {
	const response: Response = await fetch(url);
	const html: string = await response.text();

	const metaTags: any[] = html.match(/<meta[^>]*>/g) || [];
	const bodyBgMatch: RegExpMatchArray | null = html.match(/body\s*{[^}]*background-image\s*:\s*url\(["']([^"']+)["']\)[^}]*}/);
	const logoMiniMatch: RegExpMatchArray | null = html.match(/<nav[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo mini["']/);
	const headerLogoMatch: RegExpMatchArray | null = html.match(/<header[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo["']/);

	const background: string = bodyBgMatch ? bodyBgMatch[1] : "";
	const logoMini: string = logoMiniMatch ? logoMiniMatch[1] : "";
	const logo: string = headerLogoMatch ? headerLogoMatch[1] : "";

	const metaData: Record<string, string> = {background, logo, "logo-mini": logoMini};

	metaTags.forEach(tag => {
		const nameMatch = tag.match(/(name|property)=["']([^"']+)["']/);
		const contentMatch = tag.match(/content=["']([^"']+)["']/);
		if (nameMatch && contentMatch) {
			metaData[nameMatch[2]] = contentMatch[1];
		}
	});

	return metaData;
}


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

const servers: IServer[] = [];

const serverUrls: string[] = [
	"https://redhero.online/home?salsicha",
	"https://redaq.net/home?salsicha",
	"https://nullworld.net/home?salsicha",
	"https://augo.pw/",
	"https://soulforge.cc/home?salsicha",
	"https://miracleaq.world/home?salsicha",
	"https://zexelworlds.com/home?salsicha",
	"https://adventura.quest/home?salsicha",
	"https://game.aq.com/game/"
];

Promise
	.all(serverUrls.map((url: string): Promise<number> =>
		getMetaData(url)
			.then((metaTags: Record<string, string>): number => servers.push({
				url: url,
				name: metaTags["og:site_name"] || "",
				description: metaTags["description"] || "",
				logo: metaTags["logo"].replace(/\/default\/\d+/g, "/default/original") || "",
				logoMini: metaTags["logo-mini"].replace(/\/default\/\d+/g, "/default/original") || "",
				icon: metaTags["msapplication-TileImage"] || "",
				background: metaTags["background"] || "",
				themeColor: metaTags["theme-color"] || "",
			}))
	))
	.finally((): void => {
		servers.sort((a: IServer, b: IServer) => serverUrls.indexOf(a.url) - serverUrls.indexOf(b.url));
		start();
	});

const filePath: string = path.resolve("src/public/index.html");

function start(): void {
	serve({
		async fetch(req: Request): Promise<Response> {
			const _url: URL = new URL(req.url);

			if (_url.pathname === "/" && req.method === "GET") {
				return new Response(Bun.file(filePath), {
					headers: {
						"Content-Type": "text/html"
					}
				});
			}

			if (_url.pathname === "/api/servers" && req.method === "GET") {
				const sortedServers: (IServer | undefined)[] = serverUrls.map((url: string) =>
					servers.find((server: IServer): boolean => server.url === url)
				).filter(Boolean);

				return new Response(JSON.stringify({
					data: sortedServers
				}), {
					headers: {
						"Content-Type": "application/json"
					}
				});
			}

			return new Response("Not Found", {
				status: 404
			});
		},
		port: 3000,
	});
}