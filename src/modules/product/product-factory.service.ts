import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PRODUCT_TYPE } from '@common/constants';

import {
  Clothes,
  ClothesDocument,
} from './product-clothes/product-clothes.model';
import {
  Electronic,
  ElectronicDocument,
} from './product-electronic/product-electronic.model';
import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductFactoryService {
  protected productRegistry = {};

  constructor() {}

  public registerProductType(type: PRODUCT_TYPE, classRef: any): void {
    this.productRegistry[type] = classRef;
  }

  public async createProduct(
    type: PRODUCT_TYPE,
    data: Partial<ProductDocument>,
  ): Promise<OperationResult> {
    const productClass = this.productRegistry[type];
    if (!productClass) {
      return {
        success: false,
        message: 'Invalid Product Type',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const instance = new productClass(data);

    const productInstance = await instance.createProduct();

    return {
      success: true,
      data: productInstance,
    };
  }
}
