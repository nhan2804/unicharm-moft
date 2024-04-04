import { Module } from '@nestjs/common';
import { FormschemasService } from './formschemas.service';
import { FormschemasController } from './formschemas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Formschema, FormschemaSchema } from './entities/formschemas.entity';

@Module({
  controllers: [FormschemasController],
  providers: [FormschemasService],
  imports: [
    MongooseModule.forFeature([
      { name: Formschema.name, schema: FormschemaSchema },
    ]),
  ],
})
export class FormschemasModule {}
