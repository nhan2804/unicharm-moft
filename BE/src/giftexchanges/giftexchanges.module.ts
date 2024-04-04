import { Module } from '@nestjs/common';
import { GiftexchangesService } from './giftexchanges.service';
import { GiftexchangesController } from './giftexchanges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Giftexchange,
  GiftexchangeSchema,
} from './entities/giftexchanges.entity';
import { CheckinModule } from 'src/checkin/checkin.module';

@Module({
  controllers: [GiftexchangesController],
  providers: [GiftexchangesService],
  imports: [
    MongooseModule.forFeature([
      { name: Giftexchange.name, schema: GiftexchangeSchema },
    ]),
    CheckinModule,
  ],
})
export class GiftexchangesModule {}
