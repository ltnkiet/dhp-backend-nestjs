import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Clothes,
  ClothesSchema,
} from '@modules/product/product-clothes/product-clothes.model';
import {
  Electronic,
  ElectronicSchema,
} from '@modules/product/product-electronic/product-electronic.model';
import { Product, ProductSchema } from '@modules/product/product.model';
import { ProductService } from '@modules/product/product.service';

import { ClothesService } from './product-clothes/product-clothes.service';
import { ElectronicsService } from './product-electronic/product-electronic.service';
import { ProductFactoryService } from './product-factory.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Electronic.name,
        schema: ElectronicSchema,
      },
      {
        name: Clothes.name,
        schema: ClothesSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductFactoryService,
    ClothesService,
    ElectronicsService,
  ],
  exports: [
    ProductService,
    ProductFactoryService,
    ClothesService,
    ElectronicsService,
  ],
})
export class ProductModule {
  constructor(protected productFactory: ProductFactoryService) {
    this.productFactory.registerProductType('Clothes', ClothesService);
    this.productFactory.registerProductType('Electronic', ElectronicsService);
  }
}
