import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { InfraModule } from './infra/infra.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true
		}),
		InfraModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
