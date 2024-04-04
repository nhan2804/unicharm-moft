import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Groupimage } from 'src/groupimages/entities/groupimages.entity';

export type ImageDocument = Image & Document;

@Schema({
  collection: 'images',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Image {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;

  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Groupimage.name })
  groupId?: Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
