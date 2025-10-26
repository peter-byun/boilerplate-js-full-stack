import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { join } from 'path';

export default defineConfig({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  dbName: process.env.DATABASE_NAME || 'app',
  entities: [join(__dirname, './dist/entities/**/*.entity.js')],
  entitiesTs: [join(__dirname, './src/entities/**/*.entity.ts')],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: join(__dirname, './dist/migrations'),
    pathTs: join(__dirname, './src/migrations'),
  },
  extensions: [Migrator],
});
