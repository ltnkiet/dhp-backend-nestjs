import { IsEmail, IsEnum, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { KeyTokenDocument } from '@modules/key-token/key-token.model';
import { ShopDocument } from '@modules/shop/shop.model';

import { ROLE_SHOP } from '@common/constants';

export class RegisterDTO {
  @ApiProperty({
    example: 'abc@gmail.com',
  })
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'user123',
  })
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: 'Abcd@1234',
  })
  @MinLength(8)
  @MaxLength(60)
  password: string;

  @ApiProperty({
    example: ROLE_SHOP.SHOP,
  })
  @IsEnum(ROLE_SHOP)
  role: ROLE_SHOP;
}

export class CreateTokenPairDTO {
  payload: any;
  publicKey: string;
  privateKey: string;
}

export class LoginDTO {
  @ApiProperty({
    example: 'abc@gmail.com',
  })
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Abcd@1234',
  })
  @MinLength(8)
  @MaxLength(60)
  password: string;
}

export class RefreshTokenDTO {
  refreshToken: string;
  shop: ShopDocument;
  keyToken: KeyTokenDocument;
}
