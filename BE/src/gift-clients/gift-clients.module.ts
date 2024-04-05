import { Module } from '@nestjs/common';
import { GiftClientsService } from './gift-clients.service';
import { GiftClientsController } from './gift-clients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftClient, GiftClientSchema } from './entities/gift-clients.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { StoresModule } from 'src/stores/stores.module';
import { GiftClientsbillController } from './gift-clients.bill.controller';

@Module({
  controllers: [GiftClientsController, GiftClientsbillController],
  providers: [GiftClientsService],
  imports: [
    MongooseModule.forFeature([
      { name: GiftClient.name, schema: GiftClientSchema },
    ]),
    AuthModule,
    UsersModule,
    StoresModule,
  ],
})
export class GiftClientsModule {}
