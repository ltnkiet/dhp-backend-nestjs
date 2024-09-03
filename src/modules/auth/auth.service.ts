import * as crypto from 'crypto';
import {
  AuditService,
  ErrorLog,
  OperationResult,
  bcryptHelper,
} from 'mvc-common-toolkit';

import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { KeyTokenService } from '@modules/key-token/key-token.service';
import { STATUS, publicShopInfo } from '@modules/shop/shop.model';
import { ShopService } from '@modules/shop/shop.service';

import {
  APP_ACTION,
  ERR_CODE,
  INJECTION_TOKEN,
  ROLE_SHOP,
} from '@common/constants';

import {
  CreateTokenPairDTO,
  LoginDTO,
  RefreshTokenDTO,
  RegisterDTO,
} from './auth.dto';

@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);

  constructor(
    protected shopService: ShopService,
    protected keyTokenService: KeyTokenService,
    protected jwtService: JwtService,
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}

  public async createTokenPair(data: CreateTokenPairDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.jwtService.signAsync(data.payload, {
      secret: data.publicKey,
      expiresIn: '3d',
    });

    const refreshToken = await this.jwtService.signAsync(data.payload, {
      secret: data.privateKey,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  public async register(
    logId: string,
    data: RegisterDTO,
  ): Promise<OperationResult> {
    try {
      const holderShop = await this.shopService.verifyShopUniques(data.email);
      if (!holderShop.success) {
        return holderShop;
      }

      const passwordHashed = await bcryptHelper.hash(data.password);

      const newShop = await this.shopService.create({
        email: data.email.toLowerCase(),
        name: data.name,
        password: passwordHashed,
        role: ROLE_SHOP.SHOP,
        status: STATUS.ACTIVE,
        verify: true,
      });

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const keyStore = await this.keyTokenService.createKeyToken({
          shopId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: null,
        });

        if (!keyStore) {
          return keyStore;
        }

        const tokens = await this.createTokenPair({
          payload: {
            shopId: newShop._id,
            email: data.email,
          },
          publicKey,
          privateKey,
        });

        return {
          success: true,
          data: {
            newShop: publicShopInfo(newShop),
            tokens,
          },
          httpCode: HttpStatus.CREATED,
        };
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: logId,
          message: error.message,
          payload: data,
          action: APP_ACTION.REGISTER,
        }),
      );

      return {
        success: false,
        message: 'Register failed',
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    }
  }

  public async login(logId: string, data: LoginDTO): Promise<OperationResult> {
    try {
      const foundShop = await this.shopService.getOne({
        email: data.email.toLowerCase(),
      });
      if (!foundShop) {
        return {
          success: false,
          message: 'Shop is not exists',
          httpCode: HttpStatus.NOT_FOUND,
        };
      }

      const matchPassword = await bcryptHelper.compare(
        data.password,
        foundShop.password,
      );
      if (!matchPassword) {
        return {
          success: false,
          message: 'password incorrect',
          httpCode: HttpStatus.UNAUTHORIZED,
        };
      }

      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');

      const tokens = await this.createTokenPair({
        payload: {
          shopId: foundShop._id,
          email: foundShop.email,
        },
        publicKey,
        privateKey,
      });

      const keyStore = await this.keyTokenService.createKeyToken({
        shopId: foundShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        return keyStore;
      }

      return {
        success: true,
        data: {
          foundShop: publicShopInfo(foundShop),
          tokens,
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: logId,
          message: error.message,
          payload: data,
          action: APP_ACTION.LOGIN,
        }),
      );

      return {
        success: false,
        message: 'Login failed',
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    }
  }

  public async handleRefreshToken(
    logId: string,
    data: RefreshTokenDTO,
  ): Promise<OperationResult> {
    try {
      const { id: shopId, email } = data.shop;
      const { id, publicKey, privateKey, refreshToken, refreshTokenUsed } =
        data.keyToken;

      if (refreshTokenUsed.includes(refreshToken)) {
        await this.keyTokenService.deleteOne({ shopId });
      }

      if (refreshToken !== data.refreshToken) {
        return {
          success: false,
          code: ERR_CODE.INVALID_SHOP_ID,
          httpCode: HttpStatus.UNAUTHORIZED,
        };
      }

      const foundShop = await this.shopService.getOne({ shopId });
      if (!foundShop) {
        return {
          success: false,
          code: ERR_CODE.INVALID_SHOP_ID,
          httpCode: HttpStatus.UNAUTHORIZED,
        };
      }

      const tokens = await this.createTokenPair({
        payload: {
          shopId,
          email,
        },
        publicKey,
        privateKey,
      });

      await this.keyTokenService.updateOne(
        { _id: id },
        {
          $set: {
            refreshToken: tokens.refreshToken,
          },
          $addToSet: {
            refreshTokenUsed: data.refreshToken,
          },
        },
      );

      return {
        success: true,
        data: {
          refreshToken,
          refreshTokenUsed,
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: logId,
          message: error.message,
          payload: data,
          action: APP_ACTION.REFRESH_TOKEN,
        }),
      );

      return {
        success: false,
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    }
  }
}
