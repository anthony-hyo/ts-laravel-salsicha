/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

export function logger(req: Request, res: Response, next: Function) {
	console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
	next();
}
