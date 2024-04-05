import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Store } from 'src/stores/entities/stores.entity';
import { User } from 'src/users/entities/user.entity';

export type GiftClientDocument = GiftClient & Document;

@Schema({
  collection: 'gift-clients',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class GiftClient {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, index: true })
  consumerId?: Types.ObjectId;
  @IsString()
  @IsOptional()
  @Prop({ lowercase: true, unique: true, index: true })
  code?: string;
  @IsString()
  @IsOptional()
  @Prop()
  type: string;
  @Prop()
  phone?: string;
  @Prop({ default: 'PENDING' })
  status?: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: Store.name, index: true })
  storeId?: Types.ObjectId;
  @Prop({ type: Object })
  products: object;
  @Prop()
  imgClient: string;
  @Prop()
  imgBill: string;
  @Prop()
  dateCheckingBill: Date;
  @Prop({ index: true })
  codeBill?: string;
  @Prop()
  dateBill?: string;
  @Prop()
  keyCodeBill?: string;
  @Prop()
  reasonBill?: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatorId?: Types.ObjectId;
}

export const GiftClientSchema = SchemaFactory.createForClass(GiftClient);
