import { Model } from 'mongoose';
import { OperationResult } from 'mvc-common-toolkit';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseCRUDService } from '@common/services/base-crud.service';

import { CreateKeyDto } from './key-token.dto';
import { KeyToken } from './key-token.model';

@Injectable()
export class KeyTokenService extends BaseCRUDService {
  protected logger = new Logger(KeyTokenService.name);

  constructor(@InjectModel(KeyToken.name) model: Model<KeyToken>) {
    super(model);
  }

  public async createKeyToken(data: CreateKeyDto): Promise<OperationResult> {
    try {
      const tokens = await this.updateOne(
        { shopId: data.shopId },
        {
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          refreshToken: data.refreshToken,
          refreshTokenUsed: [],
        },
      );

      return {
        success: true,
        data: tokens.publicKey,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Create key token failed',
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    }
  }
}
