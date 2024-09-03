import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ProductService } from '@modules/product/product.service';

import { BaseCRUDService } from '@common/services/base-crud.service';

import { Clothes } from './product-clothes.model';

@Injectable()
export class ClothesService extends BaseCRUDService {
  constructor(
    @InjectModel(Clothes.name)
    model: Model<Clothes>,

    protected productService: ProductService,
  ) {
    super(model);
  }

  public async createProductClothes(): Promise<OperationResult> {
    const newClothing = await this.create({
      ...this.productService.productDto.product_attributes,
      product_shop: this.productService.productDto.product_shop,
    });

    if (!newClothing) {
      return {
        success: false,
        message: 'Create Clothing Error',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const newProduct = await this.productService.createProduct(newClothing.id);

    return {
      success: true,
      data: newProduct,
    };
  }
}
