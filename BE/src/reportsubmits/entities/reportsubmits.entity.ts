import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { Shift } from 'src/shifts/entities/shifts.entity';
import { Store } from 'src/stores/entities/stores.entity';
import { User } from 'src/users/entities/user.entity';

export type ReportsubmitDocument = Reportsubmit & Document;

@Schema({
  collection: 'reportsubmits',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Reportsubmit {
  @Prop()
  name?: string;
  @Prop()
  type: string;
  @Prop()
  kind?: string;
  @Prop()
  image1?: string;
  @Prop()
  image2?: string;
  //SALE
  @Prop({ type: Object })
  data?: object;

  //GIFT
  @Prop({ type: Object })
  endShiftInventory?: object;
  @Prop({ type: Object })
  startShiftInventory?: object;
  @Prop({ type: Object })
  midShiftAddProduct?: object;
  @Prop({ type: Object })
  usingGift?: object;

  @Prop({ type: Object })
  endShiftSales?: object;
  @Prop({ type: Object })
  endShiftSamplings?: object;
  @Prop({ type: Object })
  endShiftGiftExternals?: object;
  @Prop()
  imgbbnt?: string;
  @Prop()
  note?: string;

  //OOS s
  @Prop({ type: Object })
  endShiftInventoryOOS?: object;
  @Prop({ type: Object })
  startShiftInventoryOOS?: object;
  @Prop({ type: Object })
  midShiftAddProductOOS?: object;

  //SAMPLING
  @Prop({ type: Object })
  endShiftInventorySampling?: object;
  @Prop({ type: Object })
  startShiftInventorySampling?: object;
  @Prop({ type: Object })
  midShiftAddProductSampling?: object;
  @Prop({ type: Object })
  usingSampling?: object;

  //IMAGE
  @Prop({ type: Object })
  dataImage?: object;
  @Prop({ type: Object })
  extra?: object;

  @Prop({ type: SchemaTypes.ObjectId, ref: Store.name })
  storeId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: Shift.name })
  shiftId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: Checkin.name })
  checkinId?: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  creatorId?: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  updatorId?: Types.ObjectId;
}

export const ReportsubmitSchema = SchemaFactory.createForClass(Reportsubmit);
ReportsubmitSchema.index({ type: 1 });
ReportsubmitSchema.virtual('checkin', {
  ref: Checkin.name,
  localField: 'checkinId',
  foreignField: '_id',
  justOne: true,
});
