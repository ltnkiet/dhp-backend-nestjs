import { stringUtils } from 'mvc-common-toolkit';

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { HEADER_KEY } from '@common/constants';
import { AppRequest } from '@common/interfaces';

export const getLogId = (request: AppRequest) => {
  if (!request.headers[HEADER_KEY.LOG_ID]) {
    request.headers[HEADER_KEY.LOG_ID] = stringUtils.generateRandomId();
  }
  return request.headers[HEADER_KEY.LOG_ID];
};

export const getShopId = createParamDecorator(
  (_: any, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const shopId = request.headers[HEADER_KEY.CLIENT_ID]; // Assuming shop-id is set in headers
    return shopId;
  },
);

export const LogId = createParamDecorator(
  (_: any, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.headers[HEADER_KEY.LOG_ID]) {
      request.headers[HEADER_KEY.LOG_ID] = stringUtils.generateRandomId();
    }
    return request.headers[HEADER_KEY.LOG_ID];
  },
);
