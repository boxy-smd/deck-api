import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { SearchPostsByTagUseCase } from './search-posts-by-tag.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let trail: Trail
let project: Project

let sut: SearchPostsByTagUseCase

describe('search posts by tag use case', () => {
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
    trail = makeTrail({
      name: 'Design',
    })
    const subject = makeSubject({
      name: 'Comunicação Visual I',
    })

    project = makeProject({
      title: 'Awesome project',
      authorId: author.id,
      trails: [trail],
      subjectId: subject.id,
      publishedYear: 2024,
      semester: 3,
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await subjectsRepository.create(subject)
    await projectsRepository.create(project)

    sut = new SearchPostsByTagUseCase(projectsRepository)
  })

  it('should be able to search posts by trail tag', async () => {
    const result = await sut.execute({
      tag: 'Design',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by subject tag', async () => {
    const result = await sut.execute({
      tag: 'Comunicação',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by year tag', async () => {
    const result = await sut.execute({
      tag: '2024',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by semester (digit) tag', async () => {
    const result = await sut.execute({
      tag: '3',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by semester (ordinal) tag', async () => {
    const result = await sut.execute({
      tag: '3º',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should be able to search posts by semester (word) tag', async () => {
    const result = await sut.execute({
      tag: 'terceiro',
    })

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })

  it('should not return any post when tag does not match', async () => {
    const result = await sut.execute({
      tag: 'Not found',
    })

    expect(result).length(0)
  })
})
