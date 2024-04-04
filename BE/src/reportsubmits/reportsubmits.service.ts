import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import {
  Reportsubmit,
  ReportsubmitDocument,
} from './entities/reportsubmits.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
export type TypeReport =
  | 'gift'
  | 'sale'
  | 'gift-exchange'
  | 'oos'
  | 'sampling'
  | 'sup'
  | 'image';
@Injectable()
export class ReportsubmitsService extends AbstractService<Reportsubmit> {
  constructor(
    @InjectModel(Reportsubmit.name)
    readonly model: Model<ReportsubmitDocument>,
  ) {
    super(model);
  }
  async getReportByStoreId(storeId, type: TypeReport, shiftId) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.model.findOne({
      storeId: new Types.ObjectId(storeId),
      createdAt: { $gte: startOfToday },
      type: type,
      shiftId: shiftId,
    });
  }
  async getReportTodayByUserId(
    storeId,
    type: TypeReport,
    shiftId,
    userId: string,
  ) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.model.findOne({
      storeId: new Types.ObjectId(storeId),
      createdAt: { $gte: startOfToday },
      type: type,
      shiftId: shiftId,
      creatorId: new Types.ObjectId(userId),
    });
  }
}
