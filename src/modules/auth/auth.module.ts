import { Module } from '@nestjs/common';

import { GlobalModule } from '@modules/global.module';
import { KeyTokenModule } from '@modules/key-token/key-token.module';
import { ShopModule } from '@modules/shop/shop.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ShopModule, KeyTokenModule, GlobalModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
