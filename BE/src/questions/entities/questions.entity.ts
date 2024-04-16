import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Groupimage } from 'src/groupimages/entities/groupimages.entity';

export type QuestionDocument = Question & Document;

@Schema({
  collection: 'questions',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Question {
  @Prop()
  name: string;
  @Prop()
  typeQuestion: string;
  @Prop()
  exceptDepartmentIds: [];
  @Prop()
  layout?: string;
  @Prop()
  status?: string;
  @Prop()
  required: boolean;
  @Prop()
  type: string;
  @Prop({ type: Object })
  // eslint-disable-next-line @typescript-eslint/ban-types
  option: Object;
  @Prop()
  kind: string;
  @Prop()
  category: string;
  @Prop()
  description: string;
  @Prop()
  position?: number;
  @Prop()
  //for policy
  point?: number;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Groupimage.name })
  groupId?: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
