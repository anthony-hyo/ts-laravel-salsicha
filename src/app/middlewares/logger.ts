/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

export function logger(request: Request, response: Response, next: Function): void {
	console.log(`${request.method} ${request.url} - ${new Date().toISOString()}`);
	next();
}
