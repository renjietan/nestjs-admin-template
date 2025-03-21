import { ObjectLiteral } from 'typeorm'
import { Order } from '~/common/dto/pager.dto'

export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take'
}

export interface IPaginationOptions {
  page: number
  pageSize: number
  paginationType?: PaginationTypeEnum,
  field?: string,
  order?: Order,
  relations?: []
}

export interface IPaginationMeta extends ObjectLiteral {
  itemCount: number
  totalItems?: number
  itemsPerPage: number
  totalPages?: number
  currentPage: number
}

export interface IPaginationLinks {
  first?: string
  previous?: string
  next?: string
  last?: string
}
