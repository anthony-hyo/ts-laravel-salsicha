import {serve} from "bun";
import path from "path";

async function getMetaData(url: string): Promise<Record<string, string>> {
	const response = await fetch(url);
	const html = await response.text();

	const metaTags = html.match(/<meta[^>]*>/g) || [];
	const bodyBgMatch = html.match(/body\s*{[^}]*background-image\s*:\s*url\(["']([^"']+)["']\)[^}]*}/);
	const logoMiniMatch = html.match(/<nav[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo mini["']/);
	const headerLogoMatch = html.match(/<header[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*alt=["'][^"']*Logo["']/);

	const background = bodyBgMatch ? bodyBgMatch[1] : "";
	const logoMini = logoMiniMatch ? logoMiniMatch[1] : "";
	const logo = headerLogoMatch ? headerLogoMatch[1] : "";

	const metaData: Record<string, string> = { background, logo, "logo-mini": logoMini };

	metaTags.forEach(tag => {
		const nameMatch = tag.match(/(name|property)=["']([^"']+)["']/);
		const contentMatch = tag.match(/content=["']([^"']+)["']/);
		if (nameMatch && contentMatch) {
			metaData[nameMatch[2]] = contentMatch[1];
		}
	});

	console.log(metaData)

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
	.finally(() => {
		servers.sort((a, b) => serverUrls.indexOf(a.url) - serverUrls.indexOf(b.url));
		start();
	});

const filePath: string = path.resolve("src/public/index.html");

function start() {
	serve({
		async fetch(req: Request): Promise<Response> {
			const url = new URL(req.url);

			if (url.pathname === "/" && req.method === "GET") {
				return new Response(Bun.file(filePath), {
					headers: {
						"Content-Type": "text/html"
					}
				});
			}

			if (url.pathname === "/api/servers" && req.method === "GET") {
				const sortedServers = serverUrls.map(url =>
					servers.find(server => server.url === url)
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