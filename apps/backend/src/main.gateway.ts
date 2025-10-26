import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  // Create HTTP application (API Gateway)
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');

  // Connect to Redis microservice as a client
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
      retryAttempts: 5,
      retryDelay: 1000,
    },
  });

  await app.startAllMicroservices();

  const port = configService.get<number>('API_PORT', 3001);
  await app.listen(port);

  console.log(`🌐 API Gateway is running on http://localhost:${port}/api`);
  console.log(
    `🔗 Connected to Redis at ${configService.get<string>('REDIS_HOST', 'localhost')}:${configService.get<number>('REDIS_PORT', 6379)}`,
  );
}

void bootstrap();
