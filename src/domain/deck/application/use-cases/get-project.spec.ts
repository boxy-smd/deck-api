import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { ProjectDetails } from '../../enterprise/entities/value-objects/project-details.ts'
import { GetProjectUseCase } from './get-project.ts'

let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let projectsRepository: InMemoryProjectsRepository

let author: Student
let trail: Trail
let project: Project

let sut: GetProjectUseCase

describe('get project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()
    project = makeProject({
      authorId: author.id,
      trails: [trail],
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)

    sut = new GetProjectUseCase(projectsRepository)
  })

  it('should be able to get a project', async () => {
    await projectsRepository.create(project)

    const result = await sut.execute({
      projectId: project.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(ProjectDetails)
  })
})
