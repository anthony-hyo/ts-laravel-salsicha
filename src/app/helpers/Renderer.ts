/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import path from "path";
import ejs from "ejs";
import ServerApp from "../../server";
import {ejsOptions} from "../../config/config";

/**
 * Renderer class is responsible for rendering different types of responses.
 * It supports rendering views with dynamic data, as well as returning responses in HTML, JSON, text, XML, or file formats.
 */
export default class Renderer {

	/**
	 * Renders a view using EJS template engine and returns an HTML response.
	 *
	 * @param {string} view - The name of the view file (without extension).
	 * @param {object} [data={}] - The data to be injected into the view.
	 * @param {number} [statusCode=200] - The HTTP status code to return with the response.
	 * @returns {Promise<Response>} A response containing the rendered HTML.
	 *
	 * @example
	 * // Renders a view called "index" with some data
	 * const response = await Renderer.view('index', { title: 'Home' });
	 */
	public static async view(view: string, data: any = {}, statusCode: number = 200): Promise<Response> {
		const filePath: string = path.resolve(ServerApp.viewsPath, `${view}.ejs`);
		return this.html(await ejs.renderFile(filePath, data, ejsOptions), statusCode);
	}

	/**
	 * Returns an HTML response.
	 *
	 * @param {string} content - The HTML content to return.
	 * @param {number} [statusCode=200] - The HTTP status code.
	 * @returns {Response} The HTML response.
	 *
	 * @example
	 * // Returns a basic HTML response
	 * const response = Renderer.html('<h1>Hello, World!</h1>');
	 */
	public static html(content: string, statusCode: number = 200): Response {
		return new Response(content, {
			status: statusCode,
			headers: {
				"Content-Type": "text/html"
			},
		});
	}

	/**
	 * Returns a JSON response.
	 *
	 * @param {object} data - The JSON data to return.
	 * @param {number} [statusCode=200] - The HTTP status code.
	 * @returns {Response} The JSON response.
	 *
	 * @example
	 * // Returns a JSON response
	 * const response = Renderer.json({ message: 'Success' });
	 */
	public static json(data: any, statusCode: number = 200): Response {
		return new Response(JSON.stringify(data), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a plain text response.
	 *
	 * @param {string} content - The plain text content to return.
	 * @param {number} [statusCode=200] - The HTTP status code.
	 * @returns {Response} The plain text response.
	 *
	 * @example
	 * // Returns a plain text response
	 * const response = Renderer.text('Hello, World!');
	 */
	public static text(content: string, statusCode: number = 200): Response {
		return new Response(content, {
			status: statusCode,
			headers: {
				"Content-Type": "text/plain"
			},
		});
	}

	/**
	 * Returns an XML response.
	 *
	 * @param {string} content - The XML content to return.
	 * @param {number} [statusCode=200] - The HTTP status code.
	 * @returns {Response} The XML response.
	 *
	 * @example
	 * // Returns an XML response
	 * const response = Renderer.xml('<note><to>Tove</to></note>');
	 */
	public static xml(content: string, statusCode: number = 200): Response {
		return new Response(content, {
			status: statusCode,
			headers: {
				"Content-Type": "application/xml"
			},
		});
	}

	/**
	 * Returns a file response.
	 *
	 * @param {Buffer | string | ReadableStream} fileContent - The content of the file, which can be a Buffer, string, or ReadableStream.
	 * @param {string} contentType - The MIME type of the file (e.g., 'application/pdf', 'text/html', etc.).
	 * @param {number} [statusCode=200] - The HTTP status code to return. Defaults to 200 if not specified.
	 * @returns {Response} The file response with the specified content and headers.
	 *
	 * @example
	 * // Returns a file response for a binary file
	 * const response = Renderer.file(fileBuffer, 'application/pdf');
	 *
	 * @example
	 * // Returns a file response for a text file
	 * const response = Renderer.file('<h1>Hello, world!</h1>', 'text/html');
	 *
	 * @example
	 * // Returns a file response for streaming content
	 * const response = Renderer.file(stream, 'audio/mp3');
	 */
	public static file(fileContent: Buffer | string | ReadableStream, contentType: string, statusCode: number = 200): Response {
		return new Response(fileContent, {
			status: statusCode,
			headers: {
				"Content-Type": contentType,
			},
		});
	}

	/**
	 * Returns a no content response (HTTP 204).
	 *
	 * @param {number} [statusCode=204] - The HTTP status code.
	 * @returns {Response} The no content response.
	 *
	 * @example
	 * // Returns a 204 No Content response
	 * const response = Renderer.noContent();
	 */
	public static noContent(statusCode: number = 204): Response {
		return new Response(null, {
			status: statusCode
		});
	}

	/**
	 * Redirects to a specified URL.
	 *
	 * @param {string} url - The URL to redirect to.
	 * @param {number} [statusCode=302] - The HTTP status code for redirection (default is 302).
	 * @returns {Response} The redirect response.
	 *
	 * @example
	 * // Redirects to a new URL
	 * const response = Renderer.redirect('https://example.com');
	 */
	public static redirect(url: string, statusCode: number = 302): Response {
		return new Response(null, {
			status: statusCode,
			headers: {
				Location: url
			},
		});
	}

	// Error responses

	/**
	 * Returns a bad request response (HTTP 400).
	 *
	 * @param {string} [message='Bad Request'] - The error message.
	 * @param {number} [statusCode=400] - The HTTP status code.
	 * @returns {Response} The bad request response.
	 *
	 * @example
	 * // Returns a 400 Bad Request response with a custom message
	 * const response = Renderer.badRequest('Invalid input');
	 */
	public static badRequest(message: string = "Bad Request", statusCode: number = 400): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns an unauthorized response (HTTP 401).
	 *
	 * @param {string} [message='Unauthorized'] - The error message.
	 * @param {number} [statusCode=401] - The HTTP status code.
	 * @returns {Response} The unauthorized response.
	 *
	 * @example
	 * // Returns a 401 Unauthorized response
	 * const response = Renderer.unauthorized();
	 */
	public static unauthorized(message: string = "Unauthorized", statusCode: number = 401): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a forbidden response (HTTP 403).
	 *
	 * @param {string} [message='Forbidden'] - The error message.
	 * @param {number} [statusCode=403] - The HTTP status code.
	 * @returns {Response} The forbidden response.
	 *
	 * @example
	 * // Returns a 403 Forbidden response
	 * const response = Renderer.forbidden();
	 */
	public static forbidden(message: string = "Forbidden", statusCode: number = 403): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a not found response (HTTP 404).
	 *
	 * @param {string} [message='Not Found'] - The error message.
	 * @param {number} [statusCode=404] - The HTTP status code.
	 * @returns {Response} The not found response.
	 *
	 * @example
	 * // Returns a 404 Not Found response with a custom message
	 * const response = Renderer.notFound('Page not found');
	 */
	public static notFound(message: string = "Not Found", statusCode: number = 404): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a conflict response (HTTP 409).
	 *
	 * @param {string} [message='Conflict'] - The error message.
	 * @param {number} [statusCode=409] - The HTTP status code.
	 * @returns {Response} The conflict response.
	 *
	 * @example
	 * // Returns a 409 Conflict response with a custom message
	 * const response = Renderer.conflict('Data already exists');
	 */
	public static conflict(message: string = "Conflict", statusCode: number = 409): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns an unprocessable entity response (HTTP 422).
	 *
	 * @param {string} [message='Unprocessable Entity'] - The error message.
	 * @param {number} [statusCode=422] - The HTTP status code.
	 * @returns {Response} The unprocessable entity response.
	 *
	 * @example
	 * // Returns a 422 Unprocessable Entity response with a custom message
	 * const response = Renderer.unprocessableEntity('Invalid data format');
	 */
	public static unprocessableEntity(message: string = "Unprocessable Entity", statusCode: number = 422): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a too many requests response (HTTP 429).
	 *
	 * @param {string} [message='Too Many Requests'] - The error message.
	 * @param {number} [statusCode=429] - The HTTP status code.
	 * @returns {Response} The too many requests response.
	 *
	 * @example
	 * // Returns a 429 Too Many Requests response with a custom message
	 * const response = Renderer.tooManyRequests('Rate limit exceeded');
	 */
	public static tooManyRequests(message: string = "Too Many Requests", statusCode: number = 429): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns an internal server error response (HTTP 500).
	 *
	 * @param {string} [message='Internal Server Error'] - The error message.
	 * @param {number} [statusCode=500] - The HTTP status code.
	 * @returns {Response} The internal server error response.
	 *
	 * @example
	 * // Returns a 500 Internal Server Error response with a custom message
	 * const response = Renderer.serverError('Database connection failed');
	 */
	public static serverError(message: string = "Internal Server Error", statusCode: number = 500): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a gateway timeout response (HTTP 504).
	 *
	 * @param {string} [message='Gateway Timeout'] - The error message.
	 * @param {number} [statusCode=504] - The HTTP status code.
	 * @returns {Response} The gateway timeout response.
	 *
	 * @example
	 * // Returns a 504 Gateway Timeout response with a custom message
	 * const response = Renderer.gatewayTimeout('The external service took too long to respond');
	 */
	public static gatewayTimeout(message: string = "Gateway Timeout", statusCode: number = 504): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a not implemented response (HTTP 501).
	 *
	 * @param {string} [message='Not Implemented'] - The error message.
	 * @param {number} [statusCode=501] - The HTTP status code.
	 * @returns {Response} The not implemented response.
	 *
	 * @example
	 * // Returns a 501 Not Implemented response with a custom message
	 * const response = Renderer.notImplemented('Feature not supported');
	 */
	public static notImplemented(message: string = "Not Implemented", statusCode: number = 501): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	/**
	 * Returns a bad gateway response (HTTP 502).
	 *
	 * @param {string} [message='Bad Gateway'] - The error message.
	 * @param {number} [statusCode=502] - The HTTP status code.
	 * @returns {Response} The bad gateway response.
	 *
	 * @example
	 * // Returns a 502 Bad Gateway response with a custom message
	 * const response = Renderer.badGateway('Service unavailable');
	 */
	public static badGateway(message: string = "Bad Gateway", statusCode: number = 502): Response {
		return new Response(JSON.stringify({message}), {
			status: statusCode,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

}
