import { Injectable } from '@nestjs/common';
import {
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { ERROR_CODE } from '../constants/error.cons';
import { UResult, UThrowError } from 'src/helper/ulti';
export type ID = string | Types.ObjectId;
@Injectable()
export class AbstractService<T, S = T & Document> {
  protected model: Model<S>;
  constructor(
    // @InjectModel(BaseModel.name)
    model: Model<S>,
  ) {
    this.model = model;
  }
  async baseUpdateOne(id: ID, data: UpdateQuery<S>, errorCallback = null) {
    if (data?._id) delete data?._id;
    try {
      const result = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });

      return UResult(
        !!result,
        !!result ? '' : `${ERROR_CODE.NO_DATA_MATCH}`,
        result,
      );
    } catch (error) {
      errorCallback
        ? errorCallback(error, ERROR_CODE.TRY_CATCH)
        : UThrowError(
            error,
            ERROR_CODE.BAD_REQUEST,
            ERROR_CODE.BASE_UPDATE_ONE_ERROR,
          );
    }
  }
  async create(data: T) {
    const result = await this.model.create(data);
    return result;
  }
  async countDocument(filter?: FilterQuery<T>) {
    return await this.model.countDocuments(filter);
  }
  async findAllWithPaginate(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<S> | null | undefined,
    sort = {},
    page = 1,
    perPage = 20,
    populates?: PopulateOptions | Array<PopulateOptions> | any,
  ) {
    let finalSearchDate = {};
    if (Number(filter?.startTime) && Number(filter?.endTime)) {
      const fromDate = new Date(Number(filter?.startTime));
      const toDate = new Date(Number(filter?.endTime));
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);
      finalSearchDate = {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      };
    }
    sort = !sort || Object.keys(sort).length === 0 ? { createdAt: -1 } : sort;
    const endFilter = { ...filter, ...finalSearchDate };
    const getCount = this.model.countDocuments(endFilter);
    const getDocuments = this.model.find(endFilter, projection, {
      limit: perPage,
      skip: (page - 1) * perPage,
    });

    if (sort) {
      getDocuments.sort(sort);
    }
    if (populates) {
      getDocuments.populate(populates);
    }
    const [documents, count] = await Promise.all([
      await getDocuments,
      await getCount,
    ]);

    const paginate = {
      count: count,
      totalPages: Math.ceil(count / perPage),
      perPage,
    };
    return { data: documents, paginate };
  }

  async updateOne(id: ID, data: UpdateQuery<S>) {
    const result = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
    return result;
  }

  async createArray(datas: T[]) {
    const result = await this.model.insertMany(datas);
    return result;
  }

  findAll(
    filter: FilterQuery<S>,
    projection?: ProjectionType<S> | null | undefined,
    options?: QueryOptions<S> | null | undefined,
    sort?: any,
  ) {
    let finalSearchDate = {};
    if (Number(filter?.startTime) && Number(filter?.endTime)) {
      const fromDate = new Date(Number(filter?.startTime));

      const toDate = new Date(Number(filter?.endTime));
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);
      finalSearchDate = {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      };
    }
    sort = !sort || Object.keys(sort).length === 0 ? { createdAt: -1 } : sort;
    return this.model
      .find({ ...filter, ...finalSearchDate }, projection, options)
      .sort(!sort || Object.keys(sort).length === 0 ? { createdAt: -1 } : sort);
  }
  findOne(...args: Parameters<Model<S>['findOne']>) {
    return this.model.findOne(...args);
  }
  async findOneById(id: ID) {
    const result = await this.model.findOne({ _id: id });
    return result;
  }

  async update(...args: Parameters<Model<S>['updateMany']>) {
    const result = await this.model.updateMany(...args);
    return result;
  }

  async updateMany(values: T[] | any) {
    const result = await this.model.bulkWrite(values);
    return result;
  }

  async deleteMany(filter: FilterQuery<S>) {
    const result = await this.model.deleteMany(filter);
    return result;
  }

  async deleteOneById(id: ID) {
    return await this.model.deleteOne({ _id: id });
  }

  async deleteOne(filter: FilterQuery<S>) {
    const result = await this.model.deleteOne(filter);
    return result;
  }
}
