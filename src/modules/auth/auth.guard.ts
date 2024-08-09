import * as JWT from 'jsonwebtoken';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { KeyTokenService } from '@modules/key-token/key-token.service';

import { HEADER_KEY } from '@common/constants';
import { JwtPayload } from '@common/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private keyTokenService: KeyTokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const shopId = request.headers[HEADER_KEY.CLIENT_ID];

    if (!token) {
      throw new UnauthorizedException();
    }

    if (!shopId) {
      throw new UnauthorizedException('Invalid Request');
    }

    const keyStore = await this.keyTokenService.getById(shopId);
    if (!keyStore) {
      throw new NotFoundException('Not found keyStore');
    }

    if (request.headers[HEADER_KEY.REFRESH_TOKEN]) {
      try {
        const refreshToken = request.headers[HEADER_KEY.REFRESH_TOKEN];

        const decodeShop = JWT.verify(
          refreshToken,
          keyStore.privateKey,
        ) as JwtPayload;

        if (shopId !== decodeShop.shopId) {
          throw new UnauthorizedException('Invalid shopId');
        }

        request.keyStore = keyStore;
        request.shop = decodeShop;
        request.refreshToken = refreshToken;

        return true;
      } catch (error) {
        throw new UnauthorizedException(error.message);
      }
    }

    const accessToken = request.headers[HEADER_KEY.AUTHORIZATION];
    if (!accessToken) {
      throw new UnauthorizedException('Invalid Token');
    }

    try {
      const decodeShop = JWT.verify(
        accessToken,
        keyStore.publicKey,
      ) as JwtPayload;

      if (shopId !== decodeShop.shopId) {
        throw new UnauthorizedException('Invalid shopId');
      }

      request.keyStore = keyStore;
      request.shop = decodeShop;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
