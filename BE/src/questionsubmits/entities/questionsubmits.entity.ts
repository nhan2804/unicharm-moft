import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type QuestionsubmitDocument = Questionsubmit & Document;

@Schema({
  collection: 'questionsubmits',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Questionsubmit {
  @Prop()
  name?: string;
  @Prop({ type: Object })
  data?: object;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  ownerId?: object;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  updatorId?: Types.ObjectId;

  // @Prop({ type: SchemaTypes.ObjectId, ref: Store.name })
  // storeId: Types.ObjectId;
  // @Prop({ type: SchemaTypes.ObjectId, ref: Checkin.name })
  // checkinId?: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  creator?: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  updator?: Types.ObjectId;
}

export const QuestionsubmitSchema =
  SchemaFactory.createForClass(Questionsubmit);
QuestionsubmitSchema.virtual('owner', {
  ref: User.name,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
