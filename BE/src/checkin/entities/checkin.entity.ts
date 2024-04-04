import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Mixed, SchemaTypes, Types } from 'mongoose';
import { Place } from 'src/places/entities/place.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Reportsubmit } from 'src/reportsubmits/entities/reportsubmits.entity';
import { Shift } from 'src/shifts/entities/shifts.entity';
import { Store } from 'src/stores/entities/stores.entity';
import { User } from 'src/users/entities/user.entity';

export type CheckinDocument = Checkin & Document;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Checkin {
  @Prop({ type: Types.ObjectId, ref: Project.name })
  projectId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Place.name })
  placeId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  ownerId: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Shift.name })
  shiftId: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Store.name })
  storeId: Types.ObjectId;

  @Prop()
  timeCheckIn?: Date;

  @Prop()
  imageCheckin?: string;
  @Prop()
  imageCheckOut?: string;
  @Prop()
  image1Checkin?: string;

  @Prop()
  timeCheckOut?: Date;
  @Prop()
  location?: string;
  @Prop()
  locationCheckIn?: string;
  @Prop()
  locationCheckOut?: string;
  owner?: User;
  place?: Place;
  createdAt: Date;
  updateAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'reportsubmits' })
  reportImageId?: Types.ObjectId;
}

export const CheckinSchema = SchemaFactory.createForClass(Checkin);
CheckinSchema.virtual('owner', {
  ref: User.name,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
CheckinSchema.virtual('store', {
  ref: Store.name,
  localField: 'placeId',
  foreignField: '_id',
  justOne: true,
});
CheckinSchema.virtual('shift', {
  ref: Shift.name,
  localField: 'shiftId',
  foreignField: '_id',
  justOne: true,
});
