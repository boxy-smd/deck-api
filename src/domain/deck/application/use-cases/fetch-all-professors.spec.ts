import type { Professor } from '@/domain/deck/enterprise/entities/professor.entity.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { FetchAllProfessorsUseCase } from './fetch-all-professors.ts'

let professorsRepository: InMemoryProfessorsRepository
let sut: FetchAllProfessorsUseCase
let professor: Professor

describe('fetch all professors use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()
    professor = makeProfessor()

    sut = new FetchAllProfessorsUseCase(professorsRepository)
  })

  it('should be able to fetch professors', async () => {
    await professorsRepository.create(professor)

    const result = await sut.execute()

    expect(result).toBeInstanceOf(Array<Professor>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch professors with empty array', async () => {
    const result = await sut.execute()

    expect(result).toEqual([])
  })
})
