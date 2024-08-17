import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Product, ProductDocument } from '@modules/product/product.model';
import { ProductService } from '@modules/product/product.service';

import { Electronic } from './product-electronic.model';

@Injectable()
export class ElectronicsService extends ProductService {
  constructor(
    @InjectModel(Product.name) productModel: Model<ProductDocument>,
    @InjectModel(Electronic.name) private electronicModel: Model<Electronic>,
  ) {
    super(productModel, {});
  }

  public async createProduct(): Promise<OperationResult> {
    const newElectronic = await this.electronicModel.create({
      ...this.productDto.product_attributes,
      product_shop: this.productDto.product_shop,
    });

    if (!newElectronic) {
      return {
        success: false,
        message: 'Create Electronic Error',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const newProduct = await super.createProduct(newElectronic.id);

    return {
      success: true,
      data: newProduct,
    };
  }
}
