import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'

import { createPaginationObject } from './create-pagination'
import { IPaginationOptions, PaginationTypeEnum } from './interface'
import { Pagination } from './pagination'

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1

function resolveOptions(
  options: IPaginationOptions,
): [number, number, PaginationTypeEnum] {
  const { page, pageSize, paginationType } = options

  return paginationType == PaginationTypeEnum.INCLUDE_NO_PAGE ? [
    page,
    pageSize,
    paginationType
  ] : [
    page || DEFAULT_PAGE,
    pageSize || DEFAULT_LIMIT,
    paginationType || PaginationTypeEnum.TAKE_AND_SKIP,
  ]
}

async function paginateRepository<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, limit] = resolveOptions(options)

  let promises: [Promise<T[]>, Promise<number> | undefined]

  if (options.paginationType == PaginationTypeEnum.INCLUDE_NO_PAGE) {
    let where = {}
    let order = { "createdAt": searchOptions?.["order"] ?? "DESC" }
    let skip_take = !!page && !!limit && { skip: (Number(page) - 1) * Number(limit), take: Number(limit) }
    for (const key in searchOptions) {
      if (key != "page" && key != "pageSize" && key != "order") {
        where = {
          ...where,
          ...(!!searchOptions[key] && { [key]: searchOptions[key] }),
        }
      }
      promises = [
        repository.find({
          where,
          ...skip_take,
          order
        }),
        repository.count(skip_take),
      ]
    }
  } else {
    promises = [
      repository.find({
        skip: limit * (page - 1),
        take: limit,
        ...searchOptions,
      }),
      repository.count(searchOptions),
    ]
  }

  const [items, total] = await Promise.all(promises)

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  })
}

async function paginateQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, limit, paginationType] = resolveOptions(options)

  if (paginationType === PaginationTypeEnum.TAKE_AND_SKIP)
    queryBuilder.take(limit).skip((page - 1) * limit)
  else
    queryBuilder.limit(limit).offset((page - 1) * limit)

  const [items, total] = await queryBuilder.getManyAndCount()

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  })
}

export async function paginateRaw<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, limit, paginationType] = resolveOptions(options)

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    (paginationType === PaginationTypeEnum.LIMIT_AND_OFFSET
      ? queryBuilder.limit(limit).offset((page - 1) * limit)
      : queryBuilder.take(limit).skip((page - 1) * limit)
    ).getRawMany<T>(),
    queryBuilder.getCount(),
  ]

  const [items, total] = await Promise.all(promises)

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  })
}

export async function paginateRawAndEntities<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<[Pagination<T>, Partial<T>[]]> {
  const [page, limit, paginationType] = resolveOptions(options)

  const promises: [
    Promise<{ entities: T[], raw: T[] }>,
    Promise<number> | undefined,
  ] = [
      (paginationType === PaginationTypeEnum.LIMIT_AND_OFFSET
        ? queryBuilder.limit(limit).offset((page - 1) * limit)
        : queryBuilder.take(limit).skip((page - 1) * limit)
      ).getRawAndEntities<T>(),
      queryBuilder.getCount(),
    ]

  const [itemObject, total] = await Promise.all(promises)

  return [
    createPaginationObject<T>({
      items: itemObject.entities,
      totalItems: total,
      currentPage: page,
      limit,
    }),
    itemObject.raw,
  ]
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T>>

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>>

export async function paginate<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T>(repositoryOrQueryBuilder, options, searchOptions)
    : paginateQueryBuilder<T>(repositoryOrQueryBuilder, options)
}
