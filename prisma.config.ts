import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { defineConfig } from 'prisma/config';

// `.env` defines DATABASE_URL using ${VAR} references, which plain dotenv
// does not resolve. dotenv-expand interpolates them before Prisma reads it.
expand(dotenv.config());

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations'
	},
	datasource: {
		url: process.env.DATABASE_URL
	}
});
