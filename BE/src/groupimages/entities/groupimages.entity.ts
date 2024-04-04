import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type GroupimageDocument = Groupimage & Document;

@Schema({
  collection: 'groupimages',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Groupimage {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;
}

export const GroupimageSchema = SchemaFactory.createForClass(Groupimage);
