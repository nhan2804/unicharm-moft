import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Groupimage, GroupimageDocument } from './entities/groupimages.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GroupimagesService extends AbstractService<Groupimage> {
  constructor(
    @InjectModel(Groupimage.name)
    readonly model: Model<GroupimageDocument>,
  ) {
    super(model);
  }
}
