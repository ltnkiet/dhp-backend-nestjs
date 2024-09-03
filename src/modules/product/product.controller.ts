import { HttpResponse } from 'mvc-common-toolkit';

import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@modules/auth/auth.guard';
import { ShopDocument } from '@modules/shop/shop.model';

import { HEADER_KEY } from '@common/constants';
import { RequestShop } from '@common/decorators/request-auth';

import { ProductFactoryService } from './product-factory.service';
import { CreateProductDTO } from './product.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(protected productFactory: ProductFactoryService) {}

  @Post('/')
  @ApiOperation({
    description: 'create product',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async createProduct(
    @RequestShop() shop: ShopDocument,
    @Body() dto: CreateProductDTO,
  ): Promise<HttpResponse> {
    const product = await this.productFactory.createProduct(dto.product_type, {
      ...dto,
      product_shop: shop.id,
    });

    return {
      success: true,
      data: product,
    };
  }
}
