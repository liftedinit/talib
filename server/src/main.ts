import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const fetch = await import('node-fetch');
  (global as any).fetch = fetch.default;

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MANY-Explorer')
    .setDescription('MANY Protocol Explorer API')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((err) => console.error(err));
