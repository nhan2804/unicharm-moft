import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './entities/stores.entity';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  exports: [StoresService],
})
export class StoresModule {}
