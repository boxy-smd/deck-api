import { makeProject } from 'test/factories/make-project'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository'
import { SearchProjectsUseCase } from './search-projects'

let projectsRepository: InMemoryProjectsRepository
let sut: SearchProjectsUseCase

describe('search projects use case', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository()
    sut = new SearchProjectsUseCase(projectsRepository)
  })

  it('should be able to search projects by title', async () => {
    const project1 = makeProject({ title: 'React Project' })
    const project2 = makeProject({ title: 'Vue Project' })
    const project3 = makeProject({ title: 'Angular Project' })

    projectsRepository.items.push(project1, project2, project3)

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
    const project1 = makeProject({ publishedYear: 2024, semester: 1 })
    const project2 = makeProject({ publishedYear: 2024, semester: 2 })
    const project3 = makeProject({ publishedYear: 2023, semester: 1 })

    projectsRepository.items.push(project1, project2, project3)

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
    for (let i = 0; i < 25; i++) {
      projectsRepository.items.push(makeProject({ title: `Project ${i}` }))
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
    const project1 = makeProject()
    const project2 = makeProject()
    const project3 = makeProject()

    projectsRepository.items.push(project1, project2, project3)

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.projects.length).toBeGreaterThan(0)
      expect(result.value.total).toBeGreaterThan(0)
    }
  })
})