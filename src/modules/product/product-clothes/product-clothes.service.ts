import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Product, ProductDocument } from '@modules/product/product.model';
import { ProductService } from '@modules/product/product.service';

import { Clothes } from './product-clothes.model';

@Injectable()
export class ClothesService extends ProductService {
  constructor(
    @InjectModel(Product.name) productModel: Model<ProductDocument>,
    @InjectModel(Clothes.name) private clothesModel: Model<Clothes>,
  ) {
    super(productModel, {});
  }

  public async createProduct(): Promise<OperationResult> {
    const newClothing = await this.clothesModel.create({
      ...this.productDto.product_attributes,
      product_shop: this.productDto.product_shop,
    });

    if (!newClothing) {
      return {
        success: false,
        message: 'Create Clothing Error',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const newProduct = await super.createProduct(newClothing.id);

    return {
      success: true,
      data: newProduct,
    };
  }
}
