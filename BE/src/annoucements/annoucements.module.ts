import { Module } from '@nestjs/common';
import { AnnoucementsService } from './annoucements.service';
import { AnnoucementsController } from './annoucements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Annoucement, AnnoucementSchema } from './entities/annoucements.entity';

@Module({
  controllers: [AnnoucementsController],
  providers: [AnnoucementsService],
  imports: [
    MongooseModule.forFeature([{ name: Annoucement.name, schema: AnnoucementSchema }]),
  ],
})
export class AnnoucementsModule {}
