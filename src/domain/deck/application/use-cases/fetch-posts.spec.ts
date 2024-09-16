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
import { FetchPostsUseCase } from './fetch-posts.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let commentsRepository: InMemoryCommentsRepository

let author: Student
let trail: Trail
let project: Project

let sut: FetchPostsUseCase

describe('fetch posts use case', () => {
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
      authorId: author.id,
      trails: [trail],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)

    sut = new FetchPostsUseCase(projectsRepository)
  })

  it('should be able to fetch posts', async () => {
    const result = await sut.execute()

    expect(result).length(1)
    expect(result[0].title).toBe(project.title)
  })
})
