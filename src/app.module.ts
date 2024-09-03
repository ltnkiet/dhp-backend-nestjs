import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@modules/auth/auth.module';
import { KeyTokenModule } from '@modules/key-token/key-token.module';
import { ProductModule } from '@modules/product/product.module';
import { ShopModule } from '@modules/shop/shop.module';

import { AuditModule } from '@common/audit/audit.module';
import { ENV_KEY } from '@common/constants';

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
    AuthModule,
    ShopModule,
    KeyTokenModule,
    ProductModule,
  ],
})
export class AppModule {}
