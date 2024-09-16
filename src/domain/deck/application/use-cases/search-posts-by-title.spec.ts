import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { SearchPostsByTitleUseCase } from './search-posts-by-title.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let trail: Trail
let project: Project

let sut: SearchPostsByTitleUseCase

describe('search posts by title use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      commentsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()

    project = makeProject({
      title: 'Awesome project',
      authorId: author.id,
      trails: [trail],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)

    sut = new SearchPostsByTitleUseCase(projectsRepository)
  })

  it('should be able to search posts by title', async () => {
    const result = await sut.execute({
      title: 'Awesome',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by title case insensitive', async () => {
    const result = await sut.execute({
      title: 'awesome',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by title with partial match', async () => {
    const result = await sut.execute({
      title: 'some',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should not return any post when title does not match', async () => {
    const result = await sut.execute({
      title: 'Not found',
    })

    expect(result).length(0)
  })
})
