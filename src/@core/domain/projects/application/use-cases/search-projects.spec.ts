import type { UsersRepository } from '@/@core/domain/authentication/application/repositories/users-repository'
import type { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import type { ProjectsRepository } from '../repositories/projects-repository'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import type { TrailsRepository } from '../repositories/trails-repository'
import { SearchProjectsUseCase } from './search-projects'

let projectsRepository: ProjectsRepository
let studentsRepository: UsersRepository
let subjectsRepository: SubjectsRepository
let trailsRepository: TrailsRepository
let author: User
let sut: SearchProjectsUseCase

describe('search projects use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      trailsRepository,
    )

    author = await makeUser()
    await studentsRepository.create(author)

    sut = new SearchProjectsUseCase(projectsRepository)
  })

  it('should be able to search projects by title', async () => {
    const project1 = makeProject({
      title: 'React Project',
      authorId: author.id,
    })
    project1.post()

    const project2 = makeProject({
      title: 'Vue Project',
      authorId: author.id,
    })
    project2.post()

    const project3 = makeProject({
      title: 'Angular Project',
      authorId: author.id,
    })
    project3.post()

    await projectsRepository.create(project1)
    await projectsRepository.create(project2)
    await projectsRepository.create(project3)

    const result = await sut.execute({
      title: 'React',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.items).toHaveLength(1)
      expect(result.value.items[0].title).toContain('React')
      expect(result.value.total).toBe(1)
      expect(result.value.totalPages).toBe(1)
    }
  })

  it('should be able to filter projects by year and semester', async () => {
    const project1 = makeProject({
      publishedYear: 2024,
      semester: 1,
      authorId: author.id,
    })
    project1.post()

    const project2 = makeProject({
      publishedYear: 2024,
      semester: 2,
      authorId: author.id,
    })
    project2.post()

    const project3 = makeProject({
      publishedYear: 2023,
      semester: 1,
      authorId: author.id,
    })
    project3.post()

    await projectsRepository.create(project1)
    await projectsRepository.create(project2)
    await projectsRepository.create(project3)

    const result = await sut.execute({
      publishedYear: 2024,
      semester: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.items).toHaveLength(1)
      expect(result.value.items[0].publishedYear).toBe(2024)
      expect(result.value.items[0].semester).toBe(1)
    }
  })

  it('should return paginated results', async () => {
    for (let i = 0; i < 25; i++) {
      const project = makeProject({
        title: `Project ${i}`,
        authorId: author.id,
      })
      project.post()
      await projectsRepository.create(project)
    }

    const result = await sut.execute({
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.items).toHaveLength(10)
      expect(result.value.total).toBe(25)
      expect(result.value.totalPages).toBe(3)
      expect(result.value.hasNext).toBe(true)
      expect(result.value.hasPrevious).toBe(false)
    }
  })

  it('should return all projects when no filters are provided', async () => {
    const project1 = makeProject({ authorId: author.id })
    project1.post()
    const project2 = makeProject({ authorId: author.id })
    project2.post()
    const project3 = makeProject({ authorId: author.id })
    project3.post()

    await projectsRepository.create(project1)
    await projectsRepository.create(project2)
    await projectsRepository.create(project3)

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.items.length).toBeGreaterThan(0)
      expect(result.value.total).toBeGreaterThan(0)
      expect(result.value.page).toBe(1)
      expect(result.value.perPage).toBe(20)
    }
  })
})
