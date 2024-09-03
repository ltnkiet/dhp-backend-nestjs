import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Product, ProductDocument } from '@modules/product/product.model';

import { BaseCRUDService } from '@common/services/base-crud.service';

@Injectable()
export class ProductService extends BaseCRUDService {
  protected logger = new Logger(ProductService.name);
  public productDto: Partial<ProductDocument>;
  constructor(
    @InjectModel(Product.name)
    model: Model<Product>,
  ) {
    super(model);
  }

  public async createProduct(product_id: string): Promise<OperationResult> {
    const newProduct = await this.create({
      id: product_id,
      ...this.productDto,
    });

    return {
      success: true,
      data: newProduct,
    };
  }
}
