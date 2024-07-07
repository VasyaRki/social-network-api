import { IPagination } from '../../common/interfaces/pagination.interface';

export interface IFindManyUser extends Partial<IPagination> {
  readonly search?: string;
}
