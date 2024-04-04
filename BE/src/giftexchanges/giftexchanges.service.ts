import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Giftexchange, GiftexchangeDocument } from './entities/giftexchanges.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GiftexchangesService extends AbstractService<Giftexchange> {
  constructor(
    @InjectModel(Giftexchange.name)
    readonly model: Model<GiftexchangeDocument>,
  ) {
    super(model);
  }
}
