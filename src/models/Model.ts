/* eslint-disable */
export type PaginatedResponse<T> = 
  [
    T,
    {
      page: number;
      next?: () => Promise<PaginatedResponse<T>>;
      prev?: () => Promise<PaginatedResponse<T>>;
    }
  ];
/* eslint-disable */

export type _ErrorConstructor = new (message?: string) => Error;

export class Model {
  static async find(query: Record<string, any>): Promise<Model[] | PaginatedResponse<Model[]>> {
    throw new Error('Model.find not implemented');
    return await [[], { page: 1 }];
  }

  static async findById(id: string): Promise<Model | null> {
    throw new Error('Model.findById not implemented');
    return await null;
  }

  async save(): Promise<Model> {
    throw new Error('Model.save not implemented');
    return await this;
  }
}
