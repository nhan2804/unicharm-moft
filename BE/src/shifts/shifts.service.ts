import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Shift, ShiftDocument } from './entities/shifts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ShiftsService extends AbstractService<Shift> {
  constructor(
    @InjectModel(Shift.name)
    readonly model: Model<ShiftDocument>,
  ) {
    super(model);
  }
}
