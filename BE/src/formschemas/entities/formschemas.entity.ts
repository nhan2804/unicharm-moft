import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type FormschemaDocument = Formschema & Document;
@Schema({
  collection: 'formschemas',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Formschema {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;

  @Prop({})
  product?: string[];

  @Prop({})
  gift?: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  creatorId?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const FormschemaSchema = SchemaFactory.createForClass(Formschema);
