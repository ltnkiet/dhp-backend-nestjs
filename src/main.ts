import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { HttpResponseInterceptor } from '@common/interceptors/http-response.interceptor';
import { INJECTION_TOKEN } from '@common/constants';

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
  app.setGlobalPrefix('/v1/api');

  if (process.env.ENABLE_CORS === 'true') {
    app.enableCors({
      origin: '*',
      methods: '*',
      credentials: true,
    });
  }

  const auditService = app.get(INJECTION_TOKEN.AUDIT_SERVICE);

  app.useGlobalInterceptors(new HttpResponseInterceptor(auditService));

  const enableSwagger = process.env.ENABLE_SWAGGER === 'true';
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Digital Hippo Backend APIs')
      .setDescription('All backend APIs for the product.')
      .setVersion('2.0')
      .addBearerAuth({ type: 'http', in: 'header' })
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
