import { HttpResponse, stringUtils } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { KeyTokenDocument } from '@modules/key-token/key-token.model';
import { KeyTokenService } from '@modules/key-token/key-token.service';

import { ERR_CODE, HEADER_KEY } from '@common/constants';
import { RequestKeyToken } from '@common/decorators/request-auth';

import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth/shop')
export class AuthController {
  protected logger = new Logger(AuthController.name);

  constructor(
    protected authService: AuthService,
    protected keyTokenService: KeyTokenService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'register for shop' })
  public async register(@Body() dto: RegisterDTO): Promise<HttpResponse> {
    const registerResult = await this.authService.register(
      stringUtils.generateRandomId(),
      dto,
    );

    return registerResult;
  }

  @Post('login')
  @ApiOperation({ summary: 'login for shop' })
  public async login(@Body() dto: LoginDTO): Promise<HttpResponse> {
    const loginResult = await this.authService.login(
      stringUtils.generateRandomId(),
      dto,
    );

    return loginResult;
  }

  @Post('logout')
  @ApiOperation({ summary: 'logout for shop' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async logout(
    @Headers(HEADER_KEY.CLIENT_ID) shopId: string,
    @RequestKeyToken()
    token: KeyTokenDocument,
  ): Promise<HttpResponse> {
    if (!shopId) {
      return {
        success: false,
        code: ERR_CODE.INVALID_SHOP_ID,
        httpCode: HttpStatus.UNAUTHORIZED,
      };
    }

    await this.keyTokenService.deleteOne(token.id);

    return {
      success: true,
      message: 'Logout',
    };
  }
}
