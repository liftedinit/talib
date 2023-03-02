import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/configuration.service';

async function bootstrap() {
  const fetch = await import('node-fetch');
  (global as any).fetch = fetch.default;

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'warn', 'error'],
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  const config = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription('MANY Protocol Explorer API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port);
}

bootstrap().catch((err) => console.error(err));
