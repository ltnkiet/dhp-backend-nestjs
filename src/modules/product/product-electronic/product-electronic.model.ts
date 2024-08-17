import { HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HasTimestamp } from '@common/interfaces';

export type ElectronicDocument = HydratedDocument<Electronic> & HasTimestamp;

@Schema({ collection: 'electronics', timestamps: true })
export class Electronic {
  @Prop({ required: true })
  manufactuner: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: Types.ObjectId, ref: 'shops', required: true })
  product_shop: string;
}

export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
