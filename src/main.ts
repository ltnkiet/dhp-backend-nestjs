import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { HEADER_KEY, INJECTION_TOKEN } from '@common/constants';
import { HttpLoggingInterceptor } from '@common/interceptors/http-logging.interceptor';
import { HttpResponseInterceptor } from '@common/interceptors/http-response.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('/v2/api');

  if (process.env.ENABLE_CORS === 'true') {
    app.enableCors({
      origin: '*',
      methods: '*',
      credentials: true,
    });
  }

  const auditService = app.get(INJECTION_TOKEN.AUDIT_SERVICE);

  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new HttpResponseInterceptor(auditService),
  );

  const enableSwagger = process.env.ENABLE_SWAGGER === 'true';
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Digital Hippo Backend APIs')
      .setDescription('All backend APIs for the product.')
      .setVersion('2.0')
      .addBearerAuth({ type: 'http', in: 'header' })
      .addApiKey({ type: 'apiKey', in: 'header', name: HEADER_KEY.CLIENT_ID })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup('docs', app, document, customOptions);
  }

  const port = process.env.PORT;
  const mainUrl = `http://localhost:${port}`;
  await app.listen(port);
  console.log(`Server is listening on ${mainUrl}`);

  if (enableSwagger) {
    console.log(`Swagger API documentation is running on ${mainUrl}/docs`);
  }
}

bootstrap();
