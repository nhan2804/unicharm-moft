import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShiftDocument = Shift & Document;

@Schema({
  collection: 'shifts',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Shift {
  @Prop()
  name: string;

  // @Prop()
  // startTime: Date;
  // @Prop()
  // endTime: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
