import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { GiftClient, GiftClientDocument } from './entities/gift-clients.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class GiftClientsService extends AbstractService<GiftClient> {
  constructor(
    @InjectModel(GiftClient.name)
    readonly model: Model<GiftClientDocument>,
  ) {
    super(model);
  }
  async getTodayByStoreId(storeId) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return this.model.find({
      storeId: new Types.ObjectId(storeId),
      createdAt: { $gte: startOfToday },
      status: 'DONE',
    });
  }
}
