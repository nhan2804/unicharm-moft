import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Rating, RatingDocument } from './entities/ratings.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RatingsService extends AbstractService<Rating> {
  constructor(
    @InjectModel(Rating.name)
    readonly model: Model<RatingDocument>,
  ) {
    super(model);
  }
}
