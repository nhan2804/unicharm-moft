import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { Shift } from 'src/shifts/entities/shifts.entity';
import { Store } from 'src/stores/entities/stores.entity';
import { User } from 'src/users/entities/user.entity';

export type GiftexchangeDocument = Giftexchange & Document;

@Schema({
  collection: 'giftexchanges',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Giftexchange {
  @Prop()
  custName: string;

  @Prop()
  custNumber: string;

  @Prop()
  billId?: string;

  @Prop({ type: Object })
  dataSchemes?: object;
  @Prop()
  giftImage?: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  creatorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Store.name })
  storeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Checkin.name })
  checkinId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Shift.name })
  shiftId: Types.ObjectId;
}

export const GiftexchangeSchema = SchemaFactory.createForClass(Giftexchange);

GiftexchangeSchema.virtual('owner', {
  ref: User.name,
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true,
});
GiftexchangeSchema.virtual('shift', {
  ref: Shift.name,
  localField: 'shiftId',
  foreignField: '_id',
  justOne: true,
});
GiftexchangeSchema.virtual('store', {
  ref: Store.name,
  localField: 'storeId',
  foreignField: '_id',
  justOne: true,
});
