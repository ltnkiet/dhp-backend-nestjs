import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ProductService } from '@modules/product/product.service';

import { BaseCRUDService } from '@common/services/base-crud.service';

import { Electronic } from './product-electronic.model';

@Injectable()
export class ElectronicsService extends BaseCRUDService {
  constructor(
    @InjectModel(Electronic.name)
    model: Model<Electronic>,

    protected productService: ProductService,
  ) {
    super(model);
  }
  public async createElectronicAttributes(): Promise<OperationResult> {
    const newElectronicAttributes = await this.create({
      ...this.productService.productDto.product_attributes,
      product_shop: this.productService.productDto.product_shop,
    });

    if (!newElectronicAttributes) {
      return {
        success: false,
        message: 'Create Electronic Error',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const newProduct = await this.productService.createProduct(
      newElectronicAttributes.id,
    );

    return {
      success: true,
      data: newProduct,
    };
  }
}
