import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { Shift } from 'src/shifts/entities/shifts.entity';
import { Store } from 'src/stores/entities/stores.entity';
import { User } from 'src/users/entities/user.entity';

export type NotificationDocument = Notification & Document;

@Schema({
  collection: 'notifications',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Notification {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @IsOptional()
  @IsString()
  @Prop()
  note?: string;

  @Prop()
  fromTime: Date;
  @Prop()
  toTime: Date;
  @Prop({ default: 'PENDING' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  ownerId: Types.ObjectId;

  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Store.name })
  storeId: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Shift.name })
  shiftId: Types.ObjectId;
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : undefined,
  )
  @Prop({ type: Types.ObjectId, ref: Checkin.name })
  checkinId?: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.virtual('owner', {
  ref: User.name,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
NotificationSchema.virtual('store', {
  ref: Store.name,
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});
