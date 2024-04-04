import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Annoucement, AnnoucementDocument } from './entities/annoucements.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnnoucementsService extends AbstractService<Annoucement> {
  constructor(
    @InjectModel(Annoucement.name)
    readonly model: Model<AnnoucementDocument>,
  ) {
    super(model);
  }
}
