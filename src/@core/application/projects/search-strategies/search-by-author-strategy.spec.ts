import { describe, expect, it, vi } from 'vitest'
import type { ProjectsRepository } from '../repositories/projects-repository'
import { SearchByAuthorStrategy } from './search-by-author-strategy'
import type { SearchCriteria } from './search-strategy'

describe('SearchByAuthorStrategy', () => {
  it('should be able to handle if authorId is present', () => {
    const strategy = new SearchByAuthorStrategy()
    const criteria: SearchCriteria = { authorId: 'any-id' }

    expect(strategy.canHandle(criteria)).toBe(true)
  })

  it('should not be able to handle if authorId is missing', () => {
    const strategy = new SearchByAuthorStrategy()
    const criteria: SearchCriteria = {}

    expect(strategy.canHandle(criteria)).toBe(false)
  })

  it('should call repository.findManyProjectDTOsByStudentId when searching', async () => {
    const strategy = new SearchByAuthorStrategy()
    const repository = {
      findManyProjectDTOsByStudentId: vi.fn().mockResolvedValue([]),
    } as unknown as ProjectsRepository

    const criteria: SearchCriteria = { authorId: 'student-id' }
    await strategy.search(criteria, repository)

    expect(repository.findManyProjectDTOsByStudentId).toHaveBeenCalledWith(
      'student-id',
    )
  })

  it('should return empty array if authorId is missing during search', async () => {
    const strategy = new SearchByAuthorStrategy()
    const repository = {
      findManyProjectDTOsByStudentId: vi.fn(),
    } as unknown as ProjectsRepository

    const criteria: SearchCriteria = {}
    const result = await strategy.search(criteria, repository)

    expect(result).toEqual([])
    expect(repository.findManyProjectDTOsByStudentId).not.toHaveBeenCalled()
  })
})
