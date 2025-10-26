import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { LinksService } from './links/links.service';
import { Link } from './entities/link.entity';
import { LinksWorkerController } from './links/links.worker.controller';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        user: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
        dbName: configService.get<string>('DATABASE_NAME', 'app'),
        entities: [join(__dirname, './entities/**/*.entity.js')],
        entitiesTs: [join(__dirname, './entities/**/*.entity.ts')],
        debug: configService.get<string>('NODE_ENV') !== 'production',
        migrations: {
          path: join(__dirname, './migrations'),
          pathTs: join(__dirname, './migrations'),
        },
      }),
    }),
    MikroOrmModule.forFeature([Link]),
  ],
  controllers: [LinksWorkerController],
  providers: [LinksService],
})
export class WorkerModule {}
