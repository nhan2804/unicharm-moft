import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Project } from 'src/projects/entities/project.entity';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ trim: true, index: true, unique: true })
  username: string;
  @Prop()
  fullName: string;

  @Prop()
  ssoId?: string;
  @Prop()
  ssoEmail?: string;
  @Prop()
  password: string;
  @Prop({ index: 1 })
  type: string;
  @Prop()
  mode?: string;
  @Prop()
  avatar?: string;
  @Prop()
  phone?: string;
  @Prop()
  dob?: Date;
  @Prop()
  dateTraining?: Date;
  @Prop()
  dateToWork?: Date;
  @Prop()
  datePassWork?: Date;
  @Prop({ trim: true })
  passwordRaw?: string;

  @Prop({ type: Object })
  // eslint-disable-next-line @typescript-eslint/ban-types
  questionOption?: any;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'projects' })
  projectId: Types.ObjectId;
  @Prop({ default: Math.floor(Math.random() * 1000) })
  otp?: string;

  @Prop({ default: 0 })
  annoucement?: number;
  @Prop({ default: 0 })
  totalPoint?: number;
  @Prop({ default: 0 })
  point?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 }, { unique: true });
