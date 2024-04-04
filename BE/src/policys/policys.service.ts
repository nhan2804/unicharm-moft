import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Policy, PolicyDocument } from './entities/policys.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PoliciesService extends AbstractService<Policy> {
  constructor(
    @InjectModel(Policy.name)
    readonly model: Model<PolicyDocument>,
  ) {
    super(model);
  }
}
