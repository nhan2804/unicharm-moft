import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Image, ImageDocument } from './entities/images.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ImagesService extends AbstractService<Image> {
  constructor(
    @InjectModel(Image.name)
    readonly model: Model<ImageDocument>,
  ) {
    super(model);
  }
}
