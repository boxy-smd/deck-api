import { makeProject } from 'test/factories/make-project'
import { makeUser } from 'test/factories/make-user'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import { InMemoryUsersRepository } from 'test/repositories/users-repository'
import { SearchProjectsUseCase } from './search-projects'

let studentsRepository: InMemoryUsersRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let projectsRepository: InMemoryProjectsRepository
let sut: SearchProjectsUseCase

describe('search projects use case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      trailsRepository,
    )
    sut = new SearchProjectsUseCase(projectsRepository)
  })

  it('should be able to search projects by title', async () => {
    const student = makeUser()
    await studentsRepository.create(student)

    const project1 = makeProject({
      title: 'React Project',
      authorId: student.id,
    })
    project1.post() // Publicar o projeto
    
    const project2 = makeProject({
      title: 'Vue Project',
      authorId: student.id,
    })
    project2.post()
    
    const project3 = makeProject({
      title: 'Angular Project',
      authorId: student.id,
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
      expect(result.value.projects).toHaveLength(1)
      expect(result.value.projects[0].title).toContain('React')
    }
  })

  it('should be able to filter projects by year and semester', async () => {
    const student = makeUser()
    await studentsRepository.create(student)

    const project1 = makeProject({
      publishedYear: 2024,
      semester: 1,
      authorId: student.id,
    })
    project1.post()
    
    const project2 = makeProject({
      publishedYear: 2024,
      semester: 2,
      authorId: student.id,
    })
    project2.post()
    
    const project3 = makeProject({
      publishedYear: 2023,
      semester: 1,
      authorId: student.id,
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
      expect(result.value.projects).toHaveLength(1)
      expect(result.value.projects[0].publishedYear).toBe(2024)
      expect(result.value.projects[0].semester).toBe(1)
    }
  })

  it('should return paginated results', async () => {
    const student = makeUser()
    await studentsRepository.create(student)

    for (let i = 0; i < 25; i++) {
      const project = makeProject({
        title: `Project ${i}`,
        authorId: student.id,
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
      expect(result.value.projects).toHaveLength(10)
      expect(result.value.total).toBe(25)
    }
  })

  it('should return all projects when no filters are provided', async () => {
    const student = makeUser()
    await studentsRepository.create(student)

    const project1 = makeProject({ authorId: student.id })
    project1.post()
    const project2 = makeProject({ authorId: student.id })
    project2.post()
    const project3 = makeProject({ authorId: student.id })
    project3.post()

    await projectsRepository.create(project1)
    await projectsRepository.create(project2)
    await projectsRepository.create(project3)

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.projects.length).toBeGreaterThan(0)
      expect(result.value.total).toBeGreaterThan(0)
    }
  })
})