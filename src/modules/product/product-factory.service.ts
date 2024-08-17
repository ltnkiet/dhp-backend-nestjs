import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Clothes } from '@modules/product/product-clothes/product-clothes.model';
import { Electronic } from '@modules/product/product-electronic/product-electronic.model';
import { Product, ProductDocument } from '@modules/product/product.model';

@Injectable()
export class ProductFactoryService {
  protected productRegistry = {};

  constructor(
    @InjectModel(Product.name) protected productModel: Model<ProductDocument>,
    @InjectModel(Clothes.name) protected clothesModel: Model<Clothes>,
    @InjectModel(Electronic.name) protected electronicModel: Model<Electronic>,
  ) {}

  public registerProductType(type: string, classRef: any): void {
    this.productRegistry[type] = classRef;
  }

  public async createProduct(
    type: string,
    data: any,
  ): Promise<OperationResult> {
    const productClass = this.productRegistry[type];
    if (!productClass) {
      return {
        success: false,
        message: 'Invalid Product Type',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    }

    const instance = new productClass(
      this.productModel,
      this.clothesModel,
      this.electronicModel,
      data,
    );

    const productInstance = await instance.createProduct();

    return {
      success: true,
      data: productInstance,
    };
  }
}
