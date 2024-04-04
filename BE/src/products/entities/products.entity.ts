import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  collection: 'products',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  code: string;
  @Prop()
  isGiftExchange: boolean;
  @Prop()
  isSale: boolean;
  @Prop()
  isGift: boolean;
  @Prop()
  isGiftExternal: boolean;
  @Prop()
  isSampling: boolean;
  @Prop()
  isOos: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
