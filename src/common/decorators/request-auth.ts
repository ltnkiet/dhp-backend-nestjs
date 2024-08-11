import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RequestKeyToken = createParamDecorator(
  (isOptional: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const keyToken = request.keyToken;
    if (!isOptional && !keyToken) {
      throw new Error('KeyToken is missing');
    }
    return keyToken;
  },
);

export const RequestShop = createParamDecorator(
  (isOptional: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const shop = request.shop;
    if (!isOptional && (!shop || shop.deletedAt)) {
      throw new Error('Invalid shop');
    }
    return shop;
  },
);

export const RequestRefreshToken = createParamDecorator(
  (isOptional: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const refreshToken = request.refreshToken;
    if (!isOptional && !refreshToken) {
      throw new Error('RefreshToken is missing');
    }
    return refreshToken;
  },
);
