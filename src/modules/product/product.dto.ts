import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { PRODUCT_TYPE } from '@common/constants';

export class CreateProductDTO {
  @ApiProperty({ description: 'Name of the product' })
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @ApiProperty({ description: 'Thumbnail image URL of the product' })
  @IsNotEmpty()
  @IsString()
  product_thumb: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsNotEmpty()
  @IsString()
  product_description: string;

  @ApiProperty({ description: 'Quantity of the product in stock' })
  @IsNotEmpty()
  @IsNumber()
  product_quantity: number;

  @ApiProperty({ description: 'Price of the product' })
  @IsNotEmpty()
  @IsNumber()
  product_price: number;

  @ApiProperty({ description: 'Type of the product' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(PRODUCT_TYPE)
  product_type: PRODUCT_TYPE;

  @ApiProperty({ description: 'Attributes of the product', type: 'object' })
  @IsNotEmpty()
  product_attributes: Record<string, any>;

  @ApiProperty({
    description: 'Variations of the product',
    type: [Object],
    required: false,
  })
  @IsOptional()
  @IsArray()
  product_variation?: Array<any>;
}
