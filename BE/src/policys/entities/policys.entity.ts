import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type PolicyDocument = Policy & Document;

@Schema({
  collection: 'policys',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Policy {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @Prop({ required: true })
  type: string;

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
