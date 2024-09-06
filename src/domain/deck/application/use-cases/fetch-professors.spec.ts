import type { Professor } from '@/domain/deck/enterprise/entities/professor.ts'
import { makeProfessor } from 'test/factories/make-professor.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { FetchProfessorsUseCase } from './fetch-professors.ts'

let professorsRepository: InMemoryProfessorsRepository

let professor: Professor

let sut: FetchProfessorsUseCase

describe('fetch professors use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()

    professor = makeProfessor()

    sut = new FetchProfessorsUseCase(professorsRepository)
  })

  it('should be able to fetch professors', async () => {
    await professorsRepository.create(professor)

    const result = await sut.execute({})

    expect(result).toBeInstanceOf(Array<Professor>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch professors with name', async () => {
    const otherProfessor = makeProfessor({
      name: 'Other Professor',
    })

    await professorsRepository.create(otherProfessor)
    await professorsRepository.create(professor)

    const result = await sut.execute({ name: professor.name })

    expect(result).toBeInstanceOf(Array<Professor>)
    expect(result).toHaveLength(1)
    expect(result[0].name).toEqual(professor.name)
  })

  it('should be able to fetch professors with empty array', async () => {
    const result = await sut.execute({})

    expect(result).toEqual([])
  })
})
