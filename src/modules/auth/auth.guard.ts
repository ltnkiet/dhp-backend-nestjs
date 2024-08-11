import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { KeyTokenService } from '@modules/key-token/key-token.service';
import { STATUS, ShopDocument } from '@modules/shop/shop.model';
import { ShopService } from '@modules/shop/shop.service';

import { HEADER_KEY } from '@common/constants';
import { toObjectId } from '@common/utils/to-object-id';

@Injectable()
export class AuthGuard implements CanActivate {
  protected logger = new Logger(AuthGuard.name);

  constructor(
    private keyTokenService: KeyTokenService,
    private jwtService: JwtService,
    private shopService: ShopService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const shopID = request.headers[HEADER_KEY.CLIENT_ID];
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    try {
      const shop: ShopDocument = await this.shopService.getById(shopID);
      if (!shop || shop.status !== STATUS.ACTIVE) {
        throw new UnauthorizedException('Invalid Shop');
      }

      const keyToken = await this.keyTokenService.getOne({
        shopId: toObjectId(shopID),
      });
      if (!keyToken) {
        throw new NotFoundException('KeyToken not found');
      }

      const decodeShop = await this.jwtService.verifyAsync(accessToken, {
        secret: keyToken.publicKey,
      });
      request.keyToken = keyToken;
      request.shop = decodeShop;

      // const refreshToken = request.headers[HEADER_KEY.REFRESH_TOKEN];
      // if (refreshToken && refreshToken === keyToken.refreshToken) {
      //   const decodeShop = await this.jwtService.verifyAsync(refreshToken, {
      //     secret: keyToken.privateKey,
      //   });
      //
      //   if (id !== decodeShop.id) {
      //     throw new UnauthorizedException('Invalid ShopID');
      //   }
      //
      //   request.keyToken = keyToken;
      //   request.shop = decodeShop;
      //   request.refreshToken = refreshToken;
      // }
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
