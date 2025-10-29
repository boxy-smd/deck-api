import { Pagination } from './pagination'
import { describe, expect, it } from 'vitest'

describe('Pagination', () => {
  it('should paginate items correctly', () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))

    const result = Pagination.paginate(items, { page: 1, perPage: 10 })

    expect(result.items).toHaveLength(10)
    expect(result.total).toBe(25)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(10)
    expect(result.totalPages).toBe(3)
    expect(result.hasNext).toBe(true)
    expect(result.hasPrevious).toBe(false)
  })

  it('should handle last page correctly', () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))

    const result = Pagination.paginate(items, { page: 3, perPage: 10 })

    expect(result.items).toHaveLength(5)
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(true)
  })

  it('should use default values when not provided', () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }))

    const result = Pagination.paginate(items)

    expect(result.page).toBe(1)
    expect(result.perPage).toBe(20)
    expect(result.items).toHaveLength(20)
  })

  it('should respect max per page limit', () => {
    const items = Array.from({ length: 200 }, (_, i) => ({ id: i + 1 }))

    const result = Pagination.paginate(items, { page: 1, perPage: 150 })

    expect(result.perPage).toBe(100)
    expect(result.items).toHaveLength(100)
  })

  it('should calculate skip and take correctly', () => {
    const result = Pagination.getSkipAndTake({ page: 3, perPage: 10 })

    expect(result.skip).toBe(20)
    expect(result.take).toBe(10)
  })
})
