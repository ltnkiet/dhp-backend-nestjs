import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Shop, ShopSchema } from './shop.model';
import { ShopService } from './shop.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shop.name,
        schema: ShopSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
