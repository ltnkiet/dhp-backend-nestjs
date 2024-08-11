import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ERR_CODE } from '@common/constants';
import { BaseCRUDService } from '@common/services/base-crud.service';

import { Shop } from './shop.model';

@Injectable()
export class ShopService extends BaseCRUDService {
  constructor(
    @InjectModel(Shop.name)
    model: Model<Shop>,
  ) {
    super(model);
  }

  public async verifyShopUniques(email: string): Promise<OperationResult> {
    const holderShop = await this.getOne({ email: email.toLowerCase() });
    if (holderShop) {
      return {
        success: false,
        message: 'email already exists',
        code: ERR_CODE.EMAIL_ALREADY_EXISTS,
        httpCode: HttpStatus.CONFLICT,
      };
    }

    return {
      success: true,
    };
  }
}
