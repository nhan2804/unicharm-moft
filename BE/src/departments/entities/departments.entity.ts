import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({
  collection: 'departments',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Department {
  @IsString()
  @IsOptional()
  @Prop()
  name: string;

  @IsOptional()
  @IsString()
  @Prop()
  avatar?: string;
  
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
