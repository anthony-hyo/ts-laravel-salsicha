/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import {PrismaClient} from '@prisma/client';

export default class Database {
	private static _prisma: PrismaClient;

	public static get prisma(): PrismaClient {
		if (!this._prisma) {
			this.initialize();
		}

		return this._prisma;
	}

	private static initialize(): void {
		this._prisma = new PrismaClient({
			log: ['query', 'info', 'warn', 'error'], // Log queries (optional)
		});
	}

	public static async disconnect(): Promise<void> {
		if (this._prisma) {
			await this._prisma.$disconnect();
		}
	}
}
