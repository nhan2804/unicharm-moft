import { Module, forwardRef } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkin, CheckinSchema } from './entities/checkin.entity';
import { CheckinManagerController } from './checkin.manager.controller';
import { ReportsubmitsModule } from 'src/reportsubmits/reportsubmits.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CheckinController, CheckinManagerController],
  providers: [CheckinService],
  imports: [
    MongooseModule.forFeature([{ name: Checkin.name, schema: CheckinSchema }]),
    forwardRef(() => ReportsubmitsModule),
    UsersModule,
  ],
  exports: [CheckinService],
})
export class CheckinModule {}
