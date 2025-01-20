/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import ejs from "ejs";
import path from "path";

export async function render(view: string, data: Record<string, any> = {}): Promise<string> {
	const filePath = path.resolve(`./src/views/${view}`);

	return await ejs.renderFile(filePath, data);
}
