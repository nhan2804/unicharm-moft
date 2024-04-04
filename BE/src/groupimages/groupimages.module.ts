import { Module } from '@nestjs/common';
import { GroupimagesService } from './groupimages.service';
import { GroupimagesController } from './groupimages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groupimage, GroupimageSchema } from './entities/groupimages.entity';

@Module({
  controllers: [GroupimagesController],
  providers: [GroupimagesService],
  imports: [
    MongooseModule.forFeature([{ name: Groupimage.name, schema: GroupimageSchema }]),
  ],
})
export class GroupimagesModule {}
