import { Module } from '@nestjs/common';
import { PoliciesService } from './policys.service';
import { PoliciesController } from './policys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Policy, PolicySchema } from './entities/policys.entity';

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesService],
  imports: [
    MongooseModule.forFeature([{ name: Policy.name, schema: PolicySchema }]),
  ],
})
export class PoliciesModule {}
