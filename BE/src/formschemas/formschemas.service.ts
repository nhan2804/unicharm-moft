import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Formschema, FormschemaDocument } from './entities/formschemas.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FormschemasService extends AbstractService<Formschema> {
  constructor(
    @InjectModel(Formschema.name)
    readonly model: Model<FormschemaDocument>,
  ) {
    super(model);
  }
}
