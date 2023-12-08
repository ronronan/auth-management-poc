import { LogLevel, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = new Logger('App');

function logLevel(level: LogLevel): LogLevel[] {
  const levelTab: LogLevel[] = [];
  switch (level) {
    case 'verbose':
      levelTab.push('verbose');
    case 'debug':
      levelTab.push('debug');
    case 'log':
      levelTab.push('log');
    case 'warn':
      levelTab.push('warn');
    default:
      levelTab.push('error');
  }
  return levelTab;
}

async function bootstrap() {
  const levelTab = logLevel((process.env.LOG_LEVEL || 'error') as LogLevel);
  const app = await NestFactory.create(AppModule, {
    logger: levelTab,
  });
  app.setGlobalPrefix('api', { exclude: ['_health'] });

  const config = new DocumentBuilder()
    .setTitle('Partner backend')
    .setDescription('API description of Partner Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Keycloak JWT',
        description: 'Keycloak JWT token',
        in: 'header',
      },
      'Keycloak JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port, () => {
    logger.log(`[WEB] Running on port ${port}`);
  });
}
bootstrap();
