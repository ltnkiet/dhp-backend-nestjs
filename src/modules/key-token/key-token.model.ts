import { HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HasTimestamp } from '@common/interfaces';

export type KeyTokenDocument = HydratedDocument<KeyToken> & HasTimestamp;

@Schema({ collection: 'key-token', timestamps: true })
export class KeyToken {
  @Prop({ type: Types.ObjectId, ref: 'shops', required: true })
  shopId: string;

  @Prop({ required: true })
  publicKey: string;

  @Prop({ require: true })
  privateKey: string;

  @Prop({ null: true })
  refreshToken: string;

  @Prop({ type: Array, default: [] })
  refreshTokenUsed: Array<string>;
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);
