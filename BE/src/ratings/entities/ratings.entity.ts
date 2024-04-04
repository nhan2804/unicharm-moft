import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { Department } from 'src/departments/entities/departments.entity';
import { Shift } from 'src/shifts/entities/shifts.entity';
import { Store } from 'src/stores/entities/stores.entity';
import { User } from 'src/users/entities/user.entity';

export type RatingDocument = Rating & Document;

@Schema({
  collection: 'ratings',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Rating {
  @Prop()
  nameMarker: string;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: SchemaTypes.ObjectId, ref: Store.name, required: true })
  storeId: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: SchemaTypes.ObjectId, ref: Shift.name, required: true })
  shiftId: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: SchemaTypes.ObjectId, ref: Checkin.name, required: true })
  checkinId?: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  creatorId?: Types.ObjectId;

  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId?: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: SchemaTypes.ObjectId, ref: Department.name, required: true })
  departmentId?: Types.ObjectId;
  @Prop()
  phoneMarker: string;

  @Prop()
  image: string;
  @Prop({ type: Object, required: true })
  data: object;
  @Prop()
  totalPoint: string;
  @Prop()
  type: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
RatingSchema.virtual('owner', {
  ref: User.name,
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
});
RatingSchema.virtual('user', {
  ref: User.name,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
RatingSchema.virtual('store', {
  ref: Store.name,
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});
RatingSchema.virtual('shift', {
  ref: Shift.name,
  localField: 'shiftId',
  foreignField: '_id',
  justOne: true,
});
RatingSchema.virtual('department', {
  ref: Department.name,
  localField: 'departmentId',
  foreignField: '_id',
  justOne: true,
});
