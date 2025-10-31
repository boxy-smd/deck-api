export interface PaginationParams {
  page: number
  perPage: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export class Pagination {
  static readonly DEFAULT_PAGE = 1
  static readonly DEFAULT_PER_PAGE = 20
  static readonly MAX_PER_PAGE = 100

  static create<T>(
    items: T[],
    total: number,
    params: PaginationParams,
  ): PaginatedResult<T> {
    const { page, perPage } = params
    const totalPages = Math.ceil(total / perPage)

    return {
      items,
      total,
      page,
      perPage,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    }
  }

  static paginate<T>(
    items: T[],
    params: Partial<PaginationParams> = {},
  ): PaginatedResult<T> {
    const page = params.page ?? Pagination.DEFAULT_PAGE
    const perPage = Math.min(
      params.perPage ?? Pagination.DEFAULT_PER_PAGE,
      Pagination.MAX_PER_PAGE,
    )

    const total = items.length
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedItems = items.slice(startIndex, endIndex)

    return Pagination.create(paginatedItems, total, { page, perPage })
  }

  static getSkipAndTake(params: Partial<PaginationParams> = {}): {
    skip: number
    take: number
  } {
    const page = params.page ?? Pagination.DEFAULT_PAGE
    const perPage = Math.min(
      params.perPage ?? Pagination.DEFAULT_PER_PAGE,
      Pagination.MAX_PER_PAGE,
    )

    return {
      skip: (page - 1) * perPage,
      take: perPage,
    }
  }
}
