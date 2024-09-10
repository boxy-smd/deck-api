import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
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
import { DeleteProjectUseCase } from './delete-project.ts'

let studentsRepository: InMemoryStudentsRepository
let trailsRepository: InMemoryTrailsRepository
let subjectsRepository: InMemorySubjectsRepository
let projectsRepository: InMemoryProjectsRepository

let author: Student
let trail: Trail
let project: Project

let sut: DeleteProjectUseCase

describe('delete project use case', () => {
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

    await studentsRepository.save(author)
    await trailsRepository.save(trail)
    await projectsRepository.save(project)

    sut = new DeleteProjectUseCase(projectsRepository)
  })

  it('should delete a project', async () => {
    const response = await sut.execute({ projectId: project.id.toString() })

    expect(response.isRight()).toBe(true)
    expect(await projectsRepository.findById(project.id.toString())).toBe(null)
  })

  it('should return a ResourceNotFoundError when project does not exist', async () => {
    const response = await sut.execute({ projectId: 'non-existing-id' })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
