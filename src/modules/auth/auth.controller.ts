import { HttpResponse, stringUtils } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth/shop')
export class AuthController {
  constructor(protected authService: AuthService) {}

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
}
