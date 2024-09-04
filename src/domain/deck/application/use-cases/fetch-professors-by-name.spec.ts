import { makeProfessor } from 'test/factories/make-professor.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import type { Professor } from '../../enterprise/entities/professor.entity.ts'
import { FetchProfessorsByNameUseCase } from './fetch-professors-by-name.ts'

let professorsRepository: InMemoryProfessorsRepository
let sut: FetchProfessorsByNameUseCase
let professors: Professor[]

describe('fetch professors by name use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()
    professors = [
      makeProfessor({
        name: 'Ticianne Darin',
      }),
      makeProfessor({
        name: 'Ticiana Linhares',
      }),
      makeProfessor({
        name: 'George Allan',
      }),
    ]

    sut = new FetchProfessorsByNameUseCase(professorsRepository)
  })

  it('should be able to fetch professors by name', async () => {
    await professorsRepository.create(professors[0])
    await professorsRepository.create(professors[1])
    await professorsRepository.create(professors[2])

    const result = await sut.execute({ name: 'Tici' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Ticianne Darin',
        }),
        expect.objectContaining({
          name: 'Ticiana Linhares',
        }),
      ]),
    )
  })

  it('should return an empty array if no professors are found', async () => {
    const result = await sut.execute({ name: 'Ticianne Darin' })

    expect(result).toHaveLength(0)
  })
})
