import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  // Create application context to get config service
  const appContext = await NestFactory.createApplicationContext(WorkerModule);
  const configService = appContext.get(ConfigService);
  await appContext.close();

  // Create Redis microservice (Worker)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.REDIS,
      options: {
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD'),
        retryAttempts: 5,
        retryDelay: 1000,
      },
    },
  );

  await app.listen();
  console.log('⚙️  Worker microservice is listening on Redis');
  console.log(
    `🔗 Connected to Redis at ${configService.get<string>('REDIS_HOST', 'localhost')}:${configService.get<number>('REDIS_PORT', 6379)}`,
  );
}

void bootstrap();
