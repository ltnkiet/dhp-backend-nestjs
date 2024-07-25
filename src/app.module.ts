import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditModule } from '@common/audit/audit.module';
import { ENV_KEY } from '@common/interfaces';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow(ENV_KEY.MONGO_URI),
      }),
      inject: [ConfigService],
    }),
    AuditModule,
  ],
})
export class AppModule {}
