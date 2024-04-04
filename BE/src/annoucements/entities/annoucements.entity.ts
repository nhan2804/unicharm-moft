import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type AnnoucementDocument = Annoucement & Document;

@Schema({
  collection: 'annoucements',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Annoucement {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;

  @Prop()
  desc: string;

  @Prop()
  storeid: string;

  @Prop()
  fromDate: Date;

  @Prop()
  toDate: Date;
}

export const AnnoucementSchema = SchemaFactory.createForClass(Annoucement);
