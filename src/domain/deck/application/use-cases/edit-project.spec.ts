import { makeProject } from 'test/factories/make-project.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryProfessorsRepository } from 'test/repositories/professors-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import type { Project } from '../../enterprise/entities/project.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'
import { EditProjectUseCase } from './edit-project.ts'

let projectsRepository: InMemoryProjectsRepository
let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let trailsRepository: InMemoryTrailsRepository
let professorsRepository: InMemoryProfessorsRepository

let author: Student
let trail: Trail
let project: Project

let sut: EditProjectUseCase

describe('edit project use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    professorsRepository = new InMemoryProfessorsRepository()

    projectsRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
    )

    author = await makeStudent()
    trail = makeTrail()
    project = makeProject({
      status: 'DRAFT',
    })

    await studentsRepository.create(author)
    await trailsRepository.create(trail)
    await projectsRepository.create(project)

    sut = new EditProjectUseCase(
      projectsRepository,
      studentsRepository,
      subjectsRepository,
      trailsRepository,
      professorsRepository,
    )
  })

  it('should be able to edit a project', async () => {
    const response = await sut.execute({
      projectId: project.id.toString(),
      authorId: author.id.toString(),
      status: 'PUBLISHED',
    })

    expect(response.isRight()).toBe(true)
    expect(response.isRight() && response.value.status).toBe('PUBLISHED')
  })
})
