import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Store, StoreDocument } from './entities/stores.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StoresService extends AbstractService<Store> {
  constructor(
    @InjectModel(Store.name)
    readonly model: Model<StoreDocument>,
  ) {
    super(model);
  }
}
