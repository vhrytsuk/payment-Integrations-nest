import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { getCorsConfig, getSwaggerConfig } from './config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const logger = new Logger(AppModule.name);

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

	app.useGlobalPipes(new ValidationPipe());

	app.enableCors(getCorsConfig(config));

	// Ensures OnModuleDestroy hooks (e.g. Prisma $disconnect) run on SIGINT/SIGTERM.
	app.enableShutdownHooks();

	const swaggerConfig = getSwaggerConfig();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('/docs', app, swaggerDocument, {
		jsonDocumentUrl: 'openapi.json'
	});

	const port = config.getOrThrow<number>('HTTP_PORT', 4000);
	const host = config.getOrThrow<string>('HTTP_HOST');

	try {
		await app.listen(port);
		logger.log(`Application is running on: http://${host}`);
	} catch (error) {
		logger.error(`Failed to start the application: ${error}`);
		process.exit(1);
	}
}

void bootstrap();
