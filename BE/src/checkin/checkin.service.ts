import { Injectable } from '@nestjs/common';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { BaseService } from 'src/app/controllers/services/base.service';
import { Checkin, CheckinDocument } from './entities/checkin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from 'src/app/services/abstract.service';

@Injectable()
export class CheckinService extends AbstractService<Checkin> {
  constructor(
    @InjectModel(Checkin.name) readonly submitModel: Model<CheckinDocument>,
  ) {
    super(submitModel);
  }
  async getCheckinSup(queries) {}
}
