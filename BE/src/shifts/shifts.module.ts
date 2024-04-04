import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './entities/shifts.entity';

@Module({
  controllers: [ShiftsController],
  providers: [ShiftsService],
  imports: [
    MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }]),
  ],
})
export class ShiftsModule {}
