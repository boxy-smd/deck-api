import { Professor } from '@/domain/deck/enterprise/entities/professor.entity.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { FetchProfessorsByNameUseCase } from './fetch-professors-by-name.ts'

let professorsRepository: InMemoryProfessorsRepository
let sut: FetchProfessorsByNameUseCase

describe('fetch professors by name use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()
    sut = new FetchProfessorsByNameUseCase(professorsRepository)
  })

  it('should be able to fetch professors by name', async () => {
    const tici1 = Professor.create({
      name: 'Ticianne Darin',
    })

    const tici2 = Professor.create({
      name: 'Ticiana Linhares',
    })
    const george = Professor.create({
      name: 'George Allan',
    })

    await professorsRepository.create(tici1)
    await professorsRepository.create(tici2)
    await professorsRepository.create(george)

    const result = await sut.execute({ name: 'Tici' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(expect.arrayContaining([tici1, tici2]))
  })

  it('should return an empty array if no professors are found', async () => {
    const result = await sut.execute({ name: 'Ticianne Darin' })

    expect(result).toHaveLength(0)
  })
})
