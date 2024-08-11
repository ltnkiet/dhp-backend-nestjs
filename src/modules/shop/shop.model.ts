import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HasTimestamp } from '@common/interfaces';

export type ShopDocument = HydratedDocument<Shop> & HasTimestamp;

export enum STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ShopProfile {
  id: string;
  name: string;
  email: string;
}

export const publicShopInfo = (shop: ShopDocument): ShopProfile => {
  if (!shop) return null;

  const { id, name, email } = shop;
  return {
    id,
    name,
    email,
  };
};

@Schema({ collection: 'shops', timestamps: true })
export class Shop {
  @Prop()
  @ApiProperty({ type: String })
  name: string;

  @Prop({ type: String, unique: true, trim: true })
  @ApiProperty()
  email: string;

  @Prop({ type: String, require: true })
  @ApiProperty()
  password: string;

  @Prop({ enum: STATUS, default: STATUS.INACTIVE })
  @ApiProperty()
  status: string;

  @Prop({ type: Boolean, default: false })
  @ApiProperty()
  verify: boolean;

  @Prop({ type: String })
  @ApiProperty()
  roles: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
