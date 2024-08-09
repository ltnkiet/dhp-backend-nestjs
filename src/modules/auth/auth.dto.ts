import {
  IsEmail,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

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
