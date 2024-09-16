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
import { FilterPostsByQueryUseCase } from './filter-posts-by-query.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let trail: Trail
let project: Project

let sut: FilterPostsByQueryUseCase

describe('filter posts by query use case', () => {
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

    sut = new FilterPostsByQueryUseCase(projectsRepository)
  })

  it('should be able to filter posts by trails ids', async () => {
    const result = await sut.execute({
      trailsIds: [trail.id.toString()],
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id)
  })

  it('should be able to filter posts by semester', async () => {
    const result = await sut.execute({
      semester: 3,
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id)
  })

  it('should be able to filter posts by subject id', async () => {
    const result = await sut.execute({
      subjectId: project.subjectId?.toString(),
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id)
  })

  it('should be able to filter posts by published year', async () => {
    const result = await sut.execute({
      publishedYear: 2024,
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id)
  })

  it('should be able to filter posts by all queries', async () => {
    const result = await sut.execute({
      trailsIds: [trail.id.toString()],
      semester: 3,
      subjectId: project.subjectId?.toString(),
      publishedYear: 2024,
    })

    expect(result).length(1)
    expect(result[0].id).toBe(project.id)
  })

  it('should return an empty array if no posts are found', async () => {
    const result = await sut.execute({
      trailsIds: ['invalid-id'],
    })

    expect(result).length(0)
  })
})
