/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

export default class Helper {

	public static validateUrl(inputUrl: string, baseUrl: string): string {
		return /^https?:\/\//.test(inputUrl) ? inputUrl : new URL(inputUrl, baseUrl).toString();
	}

}