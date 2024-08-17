import { HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HasTimestamp } from '@common/interfaces';

export type ClothesDocument = HydratedDocument<Clothes> & HasTimestamp;

@Schema({ collection: 'clothes', timestamps: true })
export class Clothes {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  material: string;

  @Prop({ type: Types.ObjectId, ref: 'shops', required: true })
  product_shop: string;
}

export const ClothesSchema = SchemaFactory.createForClass(Clothes);
