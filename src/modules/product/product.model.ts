import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import slugify from 'slugify';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HasTimestamp } from '@common/interfaces';

export type ProductDocument = HydratedDocument<Product> & HasTimestamp;

/**
 * PRODUCT SCHEMA
 */
@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true })
  product_name: string;

  @Prop({})
  product_slug: string;

  @Prop({ required: true })
  product_thumb: string;

  @Prop({ required: true })
  product_description: string;

  @Prop({ required: true })
  product_quantity: number;

  @Prop({ required: true })
  product_price: number;

  @Prop({ required: true })
  product_type: string;

  @Prop({ type: Types.ObjectId, ref: 'shops' })
  product_shop: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  product_attributes: any;

  @Prop({
    default: 4.5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be above 5'],
    set: (val: number) => Math.round(val * 10) / 10,
  })
  product_ratingAverage: number;

  @Prop({ type: Array })
  product_variation: Array<any>;

  @Prop({ default: true, index: true, select: false })
  isDraft: boolean;

  @Prop({ default: false, index: true, select: true })
  isPublished: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

/**
 * PRODUCT INDEX SEARCH
 */
ProductSchema.index({ product_name: 'text', product_description: 'text' });

/**
 * PRODUCT MIDDLEWARE
 */
ProductSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
