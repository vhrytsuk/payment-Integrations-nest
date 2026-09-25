import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);

	constructor(configService: ConfigService) {
		const connectionString = configService.get<string>('DATABASE_URL');

		if (!connectionString) {
			throw new Error('DATABASE_URL is not defined');
		}

		super({ adapter: new PrismaPg({ connectionString }) });
	}
	public async onModuleInit(): Promise<void> {
		this.logger.log('Connecting to the database...');
		try {
			await this.$connect();
			this.logger.log('Connected to the database');
		} catch (error) {
			this.logger.error(`Failed to connect to the database: ${error}`);
			throw error;
		}
	}

	public async onModuleDestroy(): Promise<void> {
		this.logger.log('Disconnecting from the database...');
		try {
			await this.$disconnect();
			this.logger.log('Disconnected from the database');
		} catch (error) {
			this.logger.error(
				`Failed to disconnect from the database: ${error}`
			);
			throw error;
		}
	}
}
