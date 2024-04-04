import { Module, forwardRef } from '@nestjs/common';
import { ReportsubmitsService } from './reportsubmits.service';
import { ReportsubmitsController } from './reportsubmits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reportsubmit,
  ReportsubmitSchema,
} from './entities/reportsubmits.entity';
import { ReportsubmitsManagerController } from './reportsubmits.manager.controller';
import { CheckinModule } from 'src/checkin/checkin.module';

@Module({
  controllers: [ReportsubmitsController, ReportsubmitsManagerController],
  providers: [ReportsubmitsService],
  imports: [
    MongooseModule.forFeature([
      { name: Reportsubmit.name, schema: ReportsubmitSchema },
    ]),
    forwardRef(() => CheckinModule),
  ],
  exports: [ReportsubmitsService],
})
export class ReportsubmitsModule {}
