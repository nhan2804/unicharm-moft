import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';

import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
export type StoreDocument = Store & Document;

@Schema({
  collection: 'stores',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Store {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: User.name })
  userIds?: Types.ObjectId[];

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;

  @Prop()
  region: string;

  @Prop({ unique: true })
  code: string;

  @Prop()
  province: string;

  @Prop()
  desc: string;

  @IsString()
  @IsOptional()
  @Prop()
  house_num?: string;

  @IsString()
  @IsOptional()
  @Prop()
  ward?: string;
  @IsString()
  @IsOptional()
  @Prop()
  district?: string;

  @Prop()
  type?: string;
  @Prop()
  saleRep?: string;
  @Prop()
  saleSup?: string;
  @Prop()
  kam?: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
StoreSchema.virtual('users', {
  ref: User.name,
  localField: 'userIds',
  foreignField: '_id',
  // justOne: true,
});
StoreSchema.virtual('address').get(function (this: Store) {
  return `${this.province}`;
});
