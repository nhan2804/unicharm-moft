import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/app/services/abstract.service';
import { Product, ProductDocument } from './entities/products.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService extends AbstractService<Product> {
  constructor(
    @InjectModel(Product.name)
    readonly model: Model<ProductDocument>,
  ) {
    super(model);
  }
}
